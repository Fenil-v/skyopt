import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  styled,
  alpha,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import NavBar from "../components/Navbar";
import FlightCard from "../components/flights/FlightCard";
import { fetchFlightsByCriteria, fetchUserData } from "../services/_requests";
import { getToken } from "../components/Helpers.tsx";
import CouponCodeComponent from "../components/CouponCodeComponent";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  FlightLand,
  FlightTakeoff,
  HeadsetMic,
  Savings,
  Search,
} from "@mui/icons-material";
import Footer from "../components/Footer";
import ToastAlert from "../components/ToastAlert";
import { useNavigate } from "react-router-dom";
import Loader from "../components/PageLoader";

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
  },
  "& .MuiInputLabel-root": {
    transform: "translate(14px, 16px) scale(1)",
  },
  "& .MuiInputLabel-shrink": {
    transform: "translate(14px, -6px) scale(0.75)",
  },
  "& .MuiSelect-select": {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

const getAirportMappings = (t: any) => ({
  JFK: t("New York (JFK)"),
  LAX: t("Los Angeles (LAX)"),
  ORD: t("Chicago (ORD)"),
  ATL: t("Atlanta (ATL)"),
  DFW: t("Dallas (DFW)"),
  SFO: t("San Francisco (SFO)"),
  MIA: t("Miami (MIA)"),
  DEN: t("Denver (DEN)"),
  SEA: t("Seattle (SEA)"),
  BOS: t("Boston (BOS)"),
  LAS: t("Las Vegas (LAS)"),
  IAH: t("Houston (IAH)"),
  IAD: t("Washington DC (IAD)"),
  PHX: t("Phoenix (PHX)"),
  MCO: t("Orlando (MCO)"),
});

export function Home() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const token = getToken();
  const [userName, setUserName] = useState<{
    firstName: string;
    lastName: string;
  }>({ firstName: "", lastName: "" });

  const [departureCity, setDepartureCity] = useState<string>("");
  const [arrivalCity, setArrivalCity] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableFlights, setAvailableFlights] = useState<any[]>([]);

  // Features Section
  const getFeatures = (t: any) => [
    {
      icon: <Savings sx={{ fontSize: 40, color: "primary.main" }} />,
      title: t("Best Prices"),
      desc: t("Find the most competitive airfares"),
    },
    {
      icon: <FlightTakeoff sx={{ fontSize: 40, color: "primary.main" }} />,
      title: t("Direct Flights"),
      desc: t("Quick and convenient travel options"),
    },
    {
      icon: <HeadsetMic sx={{ fontSize: 40, color: "primary.main" }} />,
      title: t("24/7 Support"),
      desc: t("Always here to help you"),
    },
  ];

  // Destinations Section
  const getDestinations = (t: any) => [
    {
      city: t("New York"),
      code: "JFK",
      image: "/media/images/nyc.jpeg",
    },
    {
      city: t("San Francisco"),
      code: "SFO",
      image: "/media/images/sfo.jpg",
    },
    {
      city: t("Chicago"),
      code: "ORD",
      image: "/media/images/chicago.jpg",
    },
  ];

  // Travel Tips Section
  const getTravelTips = (t: any) => [
    {
      title: t("Book in Advance"),
      desc: t("Get the best deals by booking 3-4 months ahead"),
    },
    {
      title: t("Flexible Dates"),
      desc: t("Compare prices across different dates"),
    },
    {
      title: t("Travel Insurance"),
      desc: t("Protect your journey with comprehensive coverage"),
    },
  ];
  const translatedAirportMappings = getAirportMappings(t);
  const theme = useTheme();

  const features = getFeatures(t);
  const destinations = getDestinations(t);
  const travelTips = getTravelTips(t);

  // Add dependency array to prevent unnecessary re-renders
  useEffect(() => {
    const fetchUserMetaData = async () => {
      if (!token) {
        setUserName({ firstName: t("User"), lastName: "" });
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchUserData();
        setUserName({
          firstName: userData.data.username,
          lastName: userData.data.lastName,
        });
        setUserRole(userData.data.userRole);
      } catch (err) {
        ToastAlert({
          icon: "error",
          title: (err as Error).message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserMetaData();
  }, [token, t]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!selectedDate) {
        await ToastAlert({
          icon: "error",
          title: t("Please select a date."),
        });
        throw new Error(t("Please select a date."));
      }

      const flights = await fetchFlightsByCriteria(
        departureCity,
        arrivalCity,
        selectedDate.toISOString()
      );
      setAvailableFlights(flights.data?.data || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
      setDepartureCity("");
      setArrivalCity("");
      setSelectedDate(null);
    }
  };

  return (
    <>
      <div className="home-page">
        {token && <CouponCodeComponent token={token} />}
      </div>
      <NavBar userName={userName} />
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          py: 4,
          px: 3,
          borderRadius: "0 0 24px 24px",
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" color="white" sx={{ mb: 1 }}>
            Welcome back, {userName.firstName}!
          </Typography>
          <Typography variant="subtitle1" color="white" sx={{ opacity: 0.9 }}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Container>
      </Box>

      {userRole === "admin" && (
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate("/manage-flight")}
                  startIcon={<FlightTakeoff />}
                  sx={{
                    py: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                  }}
                >
                  Manage Flights
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      )}

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: "relative",
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.05
            )} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`,
            borderRadius: 4,
            overflow: "hidden",
            mb: 8,
          }}
        >
          {/* Background Elements */}
          <Box
            component="img"
            src="/world-map.png"
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              width: "70%",
              height: "100%",
              opacity: 0.1,
              objectFit: "cover",
            }}
          />

          {/* Content */}
          <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "4rem" },
                fontWeight: 700,
                mb: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("Discover the World with SkyOpt")}
            </Typography>

            <Typography variant="h5" color="text.secondary" sx={{ mb: 6 }}>
              {t(
                "Find and book the best flight deals to your dream destinations"
              )}
            </Typography>

            {/* Search Box */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <StyledFormControl fullWidth>
                    <InputLabel>
                      <FlightTakeoff sx={{ mr: 1 }} />
                      {t("From")}
                    </InputLabel>
                    <Select
                      value={departureCity}
                      onChange={(e) => setDepartureCity(e.target.value)}
                    >
                      {Object.keys(translatedAirportMappings).map((code) => (
                        <MenuItem key={code} value={code}>
                          {
                            translatedAirportMappings[
                              code as keyof typeof translatedAirportMappings
                            ]
                          }
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <StyledFormControl fullWidth>
                    <InputLabel>
                      <FlightLand sx={{ mr: 1 }} />
                      {t("To")}
                    </InputLabel>
                    <Select
                      value={arrivalCity}
                      onChange={(e) => setArrivalCity(e.target.value)}
                    >
                      {Object.keys(translatedAirportMappings).map((code) => (
                        <MenuItem key={code} value={code}>
                          {
                            translatedAirportMappings[
                              code as keyof typeof translatedAirportMappings
                            ]
                          }
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label={t("When")}
                      value={selectedDate ? dayjs(selectedDate) : null}
                      onChange={(newValue) =>
                        setSelectedDate(newValue ? newValue.toDate() : null)
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: {
                            "& .MuiInputBase-root": {
                              height: 56,
                              backgroundColor: "background.paper",
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Button
				  disabled={departureCity && arrivalCity && selectedDate ? false : true}
                  variant="contained"
                  size="large"
                  onClick={handleSearch}
                  startIcon={<Search />}
                  sx={{
                    py: 2,
                    px: 6,
                    borderRadius: 2,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    "&:hover": {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    },
                  }}
                >
                  {t("Search Flights")}
                </Button>
              </Box>
            </Paper>
            {/* Display search results only if available */}
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 4,
                }}
              >
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error" sx={{ mt: 4 }}>
                {error}
              </Typography>
            ) : (
              <Box sx={{ marginTop: 10 }}>
                {availableFlights.length > 0 && (
                  <Box sx={{ mb: 6 }}>
                    <Typography variant="h5" gutterBottom>
                      {t("Search Results")}
                    </Typography>
                    <Grid container spacing={3}>
                      {availableFlights.map((flight) => (
                        <Grid item xs={12} key={flight.flightNumber}>
                          <FlightCard flight={flight} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            )}
          </Container>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
            {t("Why Choose SkyOpt")}
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature) => (
              <Grid item xs={12} md={4} key={feature.title}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">{feature.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Popular Destinations */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
            {t("Popular Destinations")}
          </Typography>
          <Grid container spacing={3}>
            {destinations.map((destination) => (
              <Grid item xs={12} md={4} key={destination.code}>
                <Paper
                  elevation={0}
                  sx={{
                    position: "relative",
                    height: 200,
                    borderRadius: 3,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  <Box
                    component="img"
                    src={destination.image}
                    alt={destination.city}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 2,
                      background:
                        "linear-gradient(transparent, rgba(0,0,0,0.8))",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        fontWeight: 600,
                      }}
                    >
                      {destination.city}
                    </Typography>
                    <Typography
                      sx={{
                        color: "white",
                        opacity: 0.8,
                      }}
                    >
                      {destination.code}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            mb: 8,
            bgcolor: alpha(theme.palette.primary.main, 0.03),
            p: 4,
            borderRadius: 4,
          }}
        >
          <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
            {t("Travel Tips")}
          </Typography>
          <Grid container spacing={4}>
            {travelTips.map((tip) => (
              <Grid item xs={12} md={4} key={tip.title}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    {tip.title}
                  </Typography>
                  <Typography color="text.secondary">{tip.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <Footer />
      {loading && <Loader isLoading={false} />}
    </>
  );
}
