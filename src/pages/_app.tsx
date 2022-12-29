// src\pages\_app.tsx

import { GraphContextProvider } from "@/context/GraphContext";
import { Web3ContextProvider } from "@/context/web3Context";
import client from "@/graphql/client";
import { ApolloProvider } from "@apollo/client";
import { StyledEngineProvider } from "@mui/material";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import "../../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {

    const NEXT_PUBLIC_MORALIS_SERVER_URL = "https://rcilxpxrbaqi.usemoralis.com:2053/server";
    const NEXT_PUBLIC_MORALIS_APP_ID = "hIOGSYq1EZARrCeU5mgofDu1pbq2cUirtq9IcTSX";

    return (
        <div>
            <StyledEngineProvider injectFirst>
                <ApolloProvider client={client}>
                    <Web3ContextProvider>
                        <GraphContextProvider>
                            <MoralisProvider
                                serverUrl={
                                    NEXT_PUBLIC_MORALIS_SERVER_URL!
                                }
                                appId={NEXT_PUBLIC_MORALIS_APP_ID!}
                            >
                                <Component {...pageProps} />
                            </MoralisProvider>
                        </GraphContextProvider>
                    </Web3ContextProvider>
                </ApolloProvider>
            </StyledEngineProvider>
        </div>
    );
}

export default MyApp;
