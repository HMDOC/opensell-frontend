import http from "../http-commons";
import {CustomerModificationView} from "../component/dto/CustomerModificationView";
import {AxiosResponse} from "axios";

/**
 *
 * @author Olivier Mansuy
 */
export const getCustomerModificationView = async (link: string):Promise<AxiosResponse<CustomerModificationView>> => {
    return await http.get<CustomerModificationView>(`/c/get-customer-modification-view/${link}`);
}
