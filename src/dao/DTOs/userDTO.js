class UserDTO {
    constructor(user) {
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.role = user.role;
        this.email = user.email;
    }

    async getcurrentUser (){
        const user = {
            first_name : this.first_name,
            last_name : this.last_name,
            role : this.role,
            email : this.email
        }

        return user
    }
}

module.exports = UserDTO;