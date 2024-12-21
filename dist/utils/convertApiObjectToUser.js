"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertApiObjectToUser = void 0;
/**
 * -Take apiObject properties and translate it into User.
 *
 * @param apiObject -Object return by technopal API after a successful login
 * @returns -User object with equivalent properties from apiObject
 */
function convertApiObjectToUser(apiObject) {
    let user = {
        id_number: apiObject.user_code,
        firstname: apiObject.first_name,
        lastname: apiObject.last_name,
        middlename: apiObject.middle_name,
        email: apiObject.email_address,
        cp_number: apiObject.cp_number,
        course: apiObject.program_code,
        year_level: apiObject.year_level,
        section: apiObject.section,
        program_description: apiObject.program_description,
        is_active: apiObject.is_active === true ? 1 : 0,
        user_group: apiObject.user_group,
    };
    return user;
}
exports.convertApiObjectToUser = convertApiObjectToUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVydEFwaU9iamVjdFRvVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jb252ZXJ0QXBpT2JqZWN0VG9Vc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBOzs7OztHQUtHO0FBQ0gsU0FBZ0Isc0JBQXNCLENBQUMsU0FBNkI7SUFDaEUsSUFBSSxJQUFJLEdBQTBEO1FBQzlELFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUztRQUM5QixTQUFTLEVBQUUsU0FBUyxDQUFDLFVBQVU7UUFDL0IsUUFBUSxFQUFFLFNBQVMsQ0FBQyxTQUFTO1FBQzdCLFVBQVUsRUFBRSxTQUFTLENBQUMsV0FBVztRQUNqQyxLQUFLLEVBQUUsU0FBUyxDQUFDLGFBQWE7UUFDOUIsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTO1FBQzlCLE1BQU0sRUFBRSxTQUFTLENBQUMsWUFBWTtRQUM5QixVQUFVLEVBQUUsU0FBUyxDQUFDLFVBQVU7UUFDaEMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxPQUFPO1FBQzFCLG1CQUFtQixFQUFFLFNBQVMsQ0FBQyxtQkFBbUI7UUFDbEQsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0MsVUFBVSxFQUFFLFNBQVMsQ0FBQyxVQUFVO0tBQ25DLENBQUE7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDO0FBakJELHdEQWlCQyJ9