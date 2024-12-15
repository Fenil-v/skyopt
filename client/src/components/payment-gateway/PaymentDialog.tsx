import { Dialog, DialogContent } from "@mui/material";
import { PaymentWrapper } from "./PaymentWrapper";

interface PaymentDialogProps {
	open: boolean;
	onClose: () => void;
	bookingId: string;
	amount: number;
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
	open,
	onClose,
	bookingId,
	amount,
}) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 2,
					maxHeight: "90vh",
				},
			}}
		>
			<DialogContent>
				<PaymentWrapper bookingId={bookingId} amount={amount} />
			</DialogContent>
		</Dialog>
	);
};
