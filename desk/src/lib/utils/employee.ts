/**
 * Employee related utility functions
 * Part of `@fr8/helper` shared util
 * @author Karthikeyan M
 */
const employee = {
  /**
   * Find is given role is exist
   * @param allowed_roles given role as allowed
   * @param employee_role_names Employee actual role
   * @returns boolean
   */
  is_roles: (allowed_roles: any, employee_role_names: any) => {
    const result = employee_role_names.some((role: any) => allowed_roles.includes(role))
    return result
  },
}

export default employee