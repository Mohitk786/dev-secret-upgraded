import Razorpay from "razorpay";
import { config } from "@secret-vault/backend-common/config";


var instance = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

export default instance;