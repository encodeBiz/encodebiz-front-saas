import { logEvent } from "firebase/analytics";
import { analytics } from "../initializeApp";

/**
 * Register analitics purchase
 *
 * @param {{
 *   transaction_id: string;
 *   value: number;
 *   currency: "EUR";
 *   items: Array<{
 *     item_id: string;
 *     item_name: string;
 *     price: number;
 *     quantity: number;
 *   }>;
 * }} data 
 */
export const registerPurshase = (data: {
  transaction_id: string;
  value: number;
  currency: "EUR";
  items: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }>;
}) => {
  if(analytics){
    logEvent(analytics, "purchase", data);
  }
};
