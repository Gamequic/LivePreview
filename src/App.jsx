import { RouterProvider } from 'react-router-dom';

import ThemeCustomization from 'themes';

// routing
import router from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';
import Notistack from 'ui-component/third-party/Notistack';

// auth provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';

// ==============================|| APP ||============================== //

const App = () => {
    return (
        <ThemeCustomization>
            <RTLLayout>
                <NavigationScroll>
                    <AuthProvider>
                        <>
                            <Notistack>
                                <RouterProvider router={router} />
                                <Snackbar />
                            </Notistack>
                        </>
                    </AuthProvider>
                </NavigationScroll>
            </RTLLayout>
        </ThemeCustomization>
    );
};

export default App;
