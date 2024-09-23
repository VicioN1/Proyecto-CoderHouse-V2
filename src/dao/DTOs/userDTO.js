class UserDTO {
    constructor(user) {
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.role = user.role;
        this.email = user.email;
        this.id = user.id;
    }
}

module.exports = UserDTO;