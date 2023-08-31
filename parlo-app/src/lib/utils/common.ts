import get from "lodash/get";
import isNil from "lodash/isNil";

/**
 * Common utility functions
 * @author Karthikeyan M
 */

const common = {
  /**
   * get created by user mobile from given token 
   * @param token 
   * @returns mobile number | null
   */
  decodeToken: (token: string) => {
    if (!isNil(token)) {
      const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const phoneNumber = get(decodedToken, 'phone_number', null)
      const created_by = phoneNumber.substring(3)
      return created_by
    } else {
      return null
    }
  },
  /**
   * Get Graphql error message from given error object
   * @param error Apollo Error object
   * @returns Error message
   */
  getErrorMessage: (error: { message: any; }) => {
    const action_error = get(error, 'graphQLErrors[0].extensions.response.errors[0].message', '')
    const common_error = get(error, '"graphQLErrors[0].extensions.internal.error.message"', error?.message)
    const error_to_show = action_error === '' ? common_error : action_error
    return error_to_show
  },
  /**
   * get table sorter string
   * @param order 
   * @returns 'asc' | 'desc' | undefined
   */
  getOrderBy: (order: string | undefined) => order === 'ascend' ? 'asc' : 'descend' ? 'desc' : undefined
}

export default common
