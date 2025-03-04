const isDevMode = import.meta.env.VITE_DEV_MODE == "true";
const devContactMethod = import.meta.env.VITE_DEV_CONTACT_METHOD || "your boss";

if (isDevMode) {
    console.warn("Hi, this app is now running on dev mode, please tell to " + devContactMethod)
}

export default isDevMode;