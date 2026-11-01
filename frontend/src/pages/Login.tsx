import "./Login.css"

export default function Login() {
    return (
        <div className="container">
            <div className="form-container">
                <h1>Login</h1>
                
                <form action="" method="post">

                    <div className="form-item">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name"/>
                    </div>

                    <div className="form-item">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password"/>    
                    </div>

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}