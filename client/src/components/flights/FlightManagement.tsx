import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
	Button,
	Container,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import {
	MaterialReactTable,
	useMaterialReactTable,
	type MRT_ColumnDef,
} from "material-react-table";
import { Flight } from "../../models/_models";
import {
	fetchFlights,
	createFlight,
	updateFlight,
	deleteFlight,
} from "../../services/_requests";
import { AppDispatch } from "../../store";
import { getFetchFlights, loadFlights } from "../../store/slices/flight-store";
import { useDispatch, useSelector } from "react-redux";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SelectChangeEvent } from "@mui/material/Select";
import dayjs, { Dayjs } from "dayjs";

const AIRLINES = [
	"American Airlines",
	"Delta Air Lines",
	"United Airlines",
	"Southwest Airlines",
	"JetBlue Airways",
	"Alaska Airlines",
	"Spirit Airlines",
	"Frontier Airlines",
];

const AIRPORTS = {
	JFK: "New York (JFK)",
	LAX: "Los Angeles (LAX)",
	ORD: "Chicago (ORD)",
	ATL: "Atlanta (ATL)",
	DFW: "Dallas (DFW)",
	SFO: "San Francisco (SFO)",
	MIA: "Miami (MIA)",
	DEN: "Denver (DEN)",
	SEA: "Seattle (SEA)",
	BOS: "Boston (BOS)",
	LAS: "Las Vegas (LAS)",
	IAH: "Houston (IAH)",
	IAD: "Washington DC (IAD)",
	PHX: "Phoenix (PHX)",
	MCO: "Orlando (MCO)",
};

const FlightManagement: React.FC = () => {
	const { t } = useTranslation();

	const initialFlightState = {
		flightNumber: "",
		airline: "",
		departureCity: "",
		arrivalCity: "",
		departureTime: "",
		arrivalTime: "",
		price: 0,
		numberOfStops: 0,
		availableSeats: 0,
	};

	const [loading, setLoading] = useState(true);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
	const [originalFlightNumber, setOriginalFlightNumber] =
		useState<string>("");
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [flightToDelete, setFlightToDelete] = useState<string | null>(null);
	const [newFlight, setNewFlight] = useState({
		flightNumber: "",
		airline: "",
		departureCity: "",
		arrivalCity: "",
		departureTime: null,
		arrivalTime: null,
		price: 0,
		numberOfStops: 0,
		availableSeats: 0,
	});

	const dispatch = useDispatch<AppDispatch>();
	const flightDetails = useSelector(getFetchFlights);

	useEffect(() => {
		loadFlightsData();
	}, []);

	const loadFlightsData = async () => {
		try {
			setLoading(true);
			const data = await fetchFlights();
			dispatch(loadFlights(data.data));
		} catch (error) {
			console.error(t("Error loading flights:"), error);
		} finally {
			setLoading(false);
		}
	};

	const columns = useMemo<MRT_ColumnDef<Flight>[]>(
		() => [
			{ accessorKey: "flightNumber", header: t("Flight Number") },
			{
				accessorKey: "airline",
				header: t("Airline"),
				Cell: ({ cell }) => t(cell.getValue<string>()),
			},
			{
				accessorKey: "departureCity",
				header: t("Departure City"),
				Cell: ({ cell }) => t(cell.getValue<string>()),
			},
			{
				accessorKey: "arrivalCity",
				header: t("Arrival City"),
				Cell: ({ cell }) => t(cell.getValue<string>()),
			},
			{
				accessorKey: "departureTime",
				header: t("Departure Time"),
				Cell: ({ cell }) =>
					new Date(cell.getValue<string>()).toLocaleString(),
			},
			{
				accessorKey: "arrivalTime",
				header: t("Arrival Time"),
				Cell: ({ cell }) =>
					new Date(cell.getValue<string>()).toLocaleString(),
			},
			{
				accessorKey: "price",
				header: t("Price"),
				Cell: ({ cell }) => {
					const value = cell.getValue();
					if (value === null || value === undefined) return "$0.00";
					const number = Number(value);
					return isNaN(number) ? "$0.00" : `$${number.toFixed(2)}`;
				},
			},
			{
				accessorKey: "availableSeats",
				header: t("Available Seats"),
				Cell: ({ cell }) => cell.getValue<number>(),
			},
		],
		[t]
	);

	const handleSaveFlight = async (flight: Flight) => {
		if (editingFlight) {
			// Editing an existing flight
			try {
				await updateFlight(originalFlightNumber, flight);
				dispatch(
					loadFlights(
						flightDetails.map((f) =>
							f.flightNumber === originalFlightNumber ? flight : f
						)
					)
				);
			} catch (error) {
				console.error("Error updating flight:", error);
			}
		}
		setOpenEditDialog(false);
		setEditingFlight(null);
	};

	const handleAddFlight = async (flight: Flight) => {
		try {
			// Validate required fields before sending
			const requiredFields = [
				"flightNumber",
				"airline",
				"departureCity",
				"arrivalCity",
				"departureTime",
				"arrivalTime",
				"price",
				"availableSeats",
			];

			const missingFields = requiredFields.filter(
				(field) => !flight[field as keyof Flight]
			);

			if (missingFields.length > 0) {
				throw new Error(
					`Missing required fields: ${missingFields.join(", ")}`
				);
			}

			// Format dates properly
			const formattedFlight = {
				...flight,
				departureTime: dayjs(flight.departureTime).toISOString(),
				arrivalTime: dayjs(flight.arrivalTime).toISOString(),
				price: Number(flight.price),
				numberOfStops: Number(flight.numberOfStops),
				availableSeats: Number(flight.availableSeats),
			};

			const addedFlight = await createFlight(formattedFlight);
			dispatch(loadFlights([...flightDetails, addedFlight]));
			setOpenAddDialog(false);
			// Reset form
			setNewFlight({
				flightNumber: "",
				airline: "",
				departureCity: "",
				arrivalCity: "",
				departureTime: null,
				arrivalTime: null,
				price: 0,
				numberOfStops: 0,
				availableSeats: 0,
			});
		} catch (error: any) {
			console.error("Error creating flight: ", error);
			// Add proper error handling here
			alert(error.response?.data?.message || "Error creating flight");
		}
	};

	const handleDeleteFlight = async () => {
		if (!flightToDelete) return;
		const originalFlights = [...flightDetails];
		try {
			dispatch(
				loadFlights(
					flightDetails.filter(
						(f) => f.flightNumber !== flightToDelete
					)
				)
			);
			await deleteFlight(flightToDelete);
		} catch (error) {
			console.error("Error deleting flight:", error);
			dispatch(loadFlights(originalFlights));
		} finally {
			setDeleteConfirmOpen(false);
			setFlightToDelete(null);
		}
	};

	const handleOpenAddDialog = () => {
		setEditingFlight(null);
		setOpenAddDialog(true);
	};

	const handleOpenEditDialog = (flight: Flight) => {
		setEditingFlight(flight);
		setOriginalFlightNumber(flight.flightNumber);
		setOpenEditDialog(true);
	};

	const handleDateChange = (field: string) => (date: Dayjs | null) => {
		if (openAddDialog) {
			setNewFlight((prev) => ({
				...prev,
				[field]: date,
			}));
		} else if (openEditDialog && editingFlight) {
			setEditingFlight({
				...editingFlight,
				[field]: date,
			});
		}
	};

	const handleTextFieldChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		isEditMode: boolean
	) => {
		const { name, value } = e.target;
		if (isEditMode && editingFlight) {
			setEditingFlight({
				...editingFlight,
				[name]: value,
			});
		} else {
			setNewFlight({
				...newFlight,
				[name]: value,
			});
		}
	};

	const handleSelectChange = (
		e: SelectChangeEvent<string>,
		isEditMode: boolean
	) => {
		const { name, value } = e.target;
		if (isEditMode && editingFlight) {
			setEditingFlight({
				...editingFlight,
				[name]: value,
			});
		} else {
			setNewFlight({
				...newFlight,
				[name]: value,
			});
		}
	};

	const table = useMaterialReactTable({
		columns,
		data: flightDetails,
		state: { isLoading: loading },
		enableEditing: true,
		enableRowActions: true,
		renderRowActions: ({ row }) => (
			<>
				<Button
					onClick={() => handleOpenEditDialog(row.original)}
					color="primary"
					size="small"
				>
					{t("Edit")}
				</Button>
				<Button
					onClick={() => {
						setFlightToDelete(row.original.flightNumber);
						setDeleteConfirmOpen(true);
					}}
					color="error"
					size="small"
				>
					{t("Delete")}
				</Button>
			</>
		),
	});

	return (
		<Container>
			<Typography variant="h4" gutterBottom>
				{t("Flight Management")}
			</Typography>
			<Button
				variant="contained"
				color="primary"
				onClick={handleOpenAddDialog}
				style={{ marginBottom: "1rem" }}
			>
				{t("Add Flight")}
			</Button>
			<MaterialReactTable table={table} />

			{/* Add Dialog */}
			<Dialog
				open={openAddDialog}
				onClose={() => setOpenAddDialog(false)}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>{t("Add New Flight")}</DialogTitle>
				<DialogContent>
					<Grid container spacing={3} sx={{ mt: 1 }}>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label={t("Flight Number")}
								name="flightNumber"
								value={newFlight.flightNumber}
								onChange={(e) =>
									handleTextFieldChange(e, false)
								}
								required
								helperText={t(
									"Format: 2-3 letters followed by 3-4 numbers"
								)}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth required>
								<InputLabel>{t("Airline")}</InputLabel>
								<Select
									name="airline"
									value={newFlight.airline}
									onChange={(e) =>
										handleSelectChange(e, false)
									}
									label={t("Airline")}
								>
									{AIRLINES.map((airline) => (
										<MenuItem key={airline} value={airline}>
											{t(airline)}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth required>
								<InputLabel>{t("Departure City")}</InputLabel>
								<Select
									name="departureCity"
									value={newFlight.departureCity}
									onChange={(e) =>
										handleSelectChange(e, false)
									}
									label={t("Departure City")}
								>
									{Object.entries(AIRPORTS).map(
										([code, city]) => (
											<MenuItem key={code} value={city}>
												{t(city)}
											</MenuItem>
										)
									)}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth required>
								<InputLabel>{t("Arrival City")}</InputLabel>
								<Select
									name="arrivalCity"
									value={newFlight.arrivalCity}
									onChange={(e) =>
										handleSelectChange(e, false)
									}
									label={t("Arrival City")}
								>
									{Object.entries(AIRPORTS).map(
										([code, city]) => (
											<MenuItem key={code} value={city}>
												{t(city)}
											</MenuItem>
										)
									)}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DateTimePicker
									label={t("Departure Time")}
									value={newFlight.departureTime}
									onChange={handleDateChange("departureTime")}
									slotProps={{
										textField: {
											fullWidth: true,
											required: true,
										},
									}}
								/>
							</LocalizationProvider>
						</Grid>
						<Grid item xs={12} sm={6}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DateTimePicker
									label={t("Arrival Time")}
									value={newFlight.arrivalTime}
									onChange={handleDateChange("arrivalTime")}
									slotProps={{
										textField: {
											fullWidth: true,
											required: true,
										},
									}}
								/>
							</LocalizationProvider>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								label={t("Price")}
								name="price"
								type="number"
								value={newFlight.price}
								onChange={(e) =>
									handleTextFieldChange(e, false)
								}
								required
								inputProps={{ min: 50, max: 10000 }}
								helperText={t(
									"Price must be between $50 and $10,000"
								)}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								label={t("Number of Stops")}
								name="numberOfStops"
								type="number"
								value={newFlight.numberOfStops}
								onChange={(e) =>
									handleTextFieldChange(e, false)
								}
								inputProps={{ min: 0, max: 3 }}
								helperText={t("Maximum 3 stops allowed")}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								label={t("Available Seats")}
								name="availableSeats"
								type="number"
								value={newFlight.availableSeats}
								onChange={(e) =>
									handleTextFieldChange(e, false)
								}
								required
								inputProps={{ min: 1, max: 550 }}
								helperText={t("Between 1 and 550 seats")}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenAddDialog(false)}>
						{t("Cancel")}
					</Button>
					<Button
						color="primary"
						onClick={() =>
							handleAddFlight({
								...newFlight,
								departureTime: newFlight.departureTime || "",
								arrivalTime: newFlight.arrivalTime || "",
							})
						}
					>
						{t("Save")}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Edit Dialog */}
			<Dialog
				open={openEditDialog}
				onClose={() => setOpenEditDialog(false)}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>{t("Edit Flight")}</DialogTitle>
				<DialogContent>
					<Grid container spacing={3} sx={{ mt: 1 }}>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label={t("Flight Number")}
								name="flightNumber"
								value={editingFlight?.flightNumber}
								onChange={(e) => handleTextFieldChange(e, true)}
								required
								helperText={t(
									"Format: 2-3 letters followed by 3-4 numbers"
								)}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth required>
								<InputLabel>{t("Airline")}</InputLabel>
								<Select
									name="airline"
									value={editingFlight?.airline}
									onChange={(e) =>
										handleSelectChange(e, true)
									}
									label={t("Airline")}
								>
									{AIRLINES.map((airline) => (
										<MenuItem key={airline} value={airline}>
											{t(airline)}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth required>
								<InputLabel>{t("Departure City")}</InputLabel>
								<Select
									name="departureCity"
									value={editingFlight?.departureCity}
									onChange={(e) =>
										handleSelectChange(e, true)
									}
									label={t("Departure City")}
								>
									{Object.entries(AIRPORTS).map(
										([code, city]) => (
											<MenuItem key={code} value={city}>
												{t(city)}
											</MenuItem>
										)
									)}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth required>
								<InputLabel>{t("Arrival City")}</InputLabel>
								<Select
									name="arrivalCity"
									value={editingFlight?.arrivalCity}
									onChange={(e) =>
										handleSelectChange(e, true)
									}
									label={t("Arrival City")}
								>
									{Object.entries(AIRPORTS).map(
										([code, city]) => (
											<MenuItem key={code} value={city}>
												{t(city)}
											</MenuItem>
										)
									)}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DateTimePicker
									label={t("Departure Time")}
									value={dayjs(editingFlight?.departureTime)}
									onChange={handleDateChange("departureTime")}
									slotProps={{
										textField: {
											fullWidth: true,
											required: true,
										},
									}}
								/>
							</LocalizationProvider>
						</Grid>
						<Grid item xs={12} sm={6}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DateTimePicker
									label={t("Arrival Time")}
									value={
										editingFlight?.arrivalTime
											? dayjs(editingFlight?.arrivalTime)
											: null
									}
									onChange={handleDateChange("arrivalTime")}
									slotProps={{
										textField: {
											fullWidth: true,
											required: true,
										},
									}}
								/>
							</LocalizationProvider>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								label={t("Price")}
								name="price"
								type="number"
								value={editingFlight?.price}
								onChange={(e) => handleTextFieldChange(e, true)}
								required
								inputProps={{ min: 50, max: 10000 }}
								helperText={t(
									"Price must be between $50 and $10,000"
								)}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								label={t("Number of Stops")}
								name="numberOfStops"
								type="number"
								value={editingFlight?.numberOfStops}
								onChange={(e) => handleTextFieldChange(e, true)}
								inputProps={{ min: 0, max: 3 }}
								helperText={t("Maximum 3 stops allowed")}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								label={t("Available Seats")}
								name="availableSeats"
								type="number"
								value={editingFlight?.availableSeats}
								onChange={(e) => handleTextFieldChange(e, true)}
								required
								inputProps={{ min: 1, max: 550 }}
								helperText={t("Between 1 and 550 seats")}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenEditDialog(false)}>
						{t("Cancel")}
					</Button>
					<Button
						color="primary"
						onClick={() =>
							handleSaveFlight(
								editingFlight || initialFlightState
							)
						}
					>
						{t("Save")}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={deleteConfirmOpen}
				onClose={() => setDeleteConfirmOpen(false)}
			>
				<DialogTitle>{t("Confirm Deletion")}</DialogTitle>
				<DialogContent>
					<Typography>
						{t("Are you sure you want to delete this flight?")}
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteConfirmOpen(false)}>
						{t("Cancel")}
					</Button>
					<Button color="error" onClick={handleDeleteFlight}>
						{t("Delete")}
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default FlightManagement;
