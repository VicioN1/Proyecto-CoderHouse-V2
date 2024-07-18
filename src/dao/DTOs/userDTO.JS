class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.name = user.name;
        this.email = user.email;
        // Agrega otros campos que sean necesarios
    }
}

module.exports = UserDTO;