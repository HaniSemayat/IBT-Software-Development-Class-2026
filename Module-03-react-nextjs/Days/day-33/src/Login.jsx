import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "./auth/useAuth";

function Login() {
    const [phone, setPhone] = useState("");

    const { login } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const from =
        location.state?.from?.pathname ?? "/menu";

    const phoneIsValid =
        /^(?:\+251|0)9\d{8}$/.test(phone);

    function handleSubmit(event) {
        event.preventDefault();

        if (!phoneIsValid) {
            return;
        }

        login(phone);

        navigate(from, {
            replace: true
        });
    }

    return (
        <section>
            <h2>Sign In</h2>

            <form onSubmit={handleSubmit}>
                <label>
                    TeleBirr Phone

                    <input
                        type="tel"
                        value={phone}
                        onChange={(event) =>
                            setPhone(event.target.value)
                        }
                        placeholder="0911223344"
                        required
                    />
                </label>

                {!phoneIsValid &&
                    phone !== "" && (
                        <p className="error">
                            Enter a valid TeleBirr number.
                        </p>
                    )}

                <button
                    type="submit"
                    disabled={!phoneIsValid}
                >
                    Sign In
                </button>
            </form>
        </section>
    );
}

export default Login;