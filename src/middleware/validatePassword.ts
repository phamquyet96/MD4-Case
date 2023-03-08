class registerValidate {
    check = ( password: string): string => {
        let regexpPassword = new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-1])(?=.*[!@#$%^?&*-])[a-zA-Z\d!@#$?%^&*-].{6,}$/
        );
        let resultPassword = regexpPassword.test(password);
        let result = '';

        if (resultPassword) {
            result = 'passwordValid';
        } else if (!resultPassword) {
            result = 'passwordInvalid';
        }

        return result;
    };
}

export default new registerValidate();