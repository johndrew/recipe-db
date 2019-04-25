class UserService {

    async login(email, password) {

        return await fetch('https://us-central1-recipedb-d75ba.cloudfunctions.net/login', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                email,
                password,
            },
        })
            .then((result) => {
                
                if (!result.ok) {

                    return result.text().then(text => { throw new Error(text) })
                }
                return result.json();
            })
            .then(({ token }) => {

                return token;
            })
            .catch((e) => {
                
                throw new Error(`Could not get recipes: ${e.message}`);
            });
    }
}

export default new UserService();