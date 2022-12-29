/* eslint-disable prefer-const */
/* eslint-disable no-console */
import { GET_SOCIAL } from "@/graphql/queries/get_social";
import { formatAddress } from "@/utils/helper";
import { useQuery } from "@apollo/client";
import {
    githubAuthorize,
    githubVerify,
    twitterAuthorize,
    twitterVerify
} from "@cyberlab/social-verifier";

import { Modal } from "@mantine/core";

import { useEffect, useState } from "react";
import styles from "./index.module.css";

interface Props {
    address: string;
}

export const SocialSection = ({ address }: Props) => {
    const [socialData, setsocialData] = useState<any>([]);
    const [twitteropened, setTwitterOpened] = useState(false);
    const [githubopened, setGithubOpened] = useState(false);
    const [handle, setHandle] = useState<string>("");
    const [gistID, setGistID] = useState<string>("");
    const { data, refetch } = useQuery(GET_SOCIAL, {
        variables: {
            address: address,
        },
    });

    useEffect(() => {
        refetch();
        if (data) {
            console.log(data.identity.github.username);
            setsocialData(data);
        }
    }, [data, refetch]);

    const tweetButtonClick = async () => {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        // Check clause for handle
        if (!handle) return;

        // Generate the signature
        const sig = await twitterAuthorize(
            window.ethereum,
            accounts[0],
            handle
        );

        // The message that the user posts on Twitter
        const message = `${sig}`;

        console.log("message:", message);
        // Open new window so that the user can post on Twitter
        window.open(
            `https://twitter.com/intent/tweet?text=${message}`,
            "_blank"
        );
    };

    const twitterVerifyClick = async () => {
        // Get the MetaMask wallet address
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        if (!handle) return;

        // Verify the Twitter account
        await twitterVerify(accounts[0], handle);
        alert(`Success: you've verified ${handle}!`);
    };

    const githubVerifyMessageClick = async () => {
        // alert(1);
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        const handle = prompt("Enter your Github handle:");
        if (!handle) return;

        setHandle(handle);

        const sig = await githubAuthorize(window.ethereum, accounts[0], handle);
        console.log("sig:", sig);
        window.prompt("Copy to clipboard: Ctrl+C, Enter", sig);
    };

    const githubOpenClick = async () => {
        window.open(`https://gist.github.com/${handle}`, "_blank");
    };

    const githubVerifyClick = async () => {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        const modalgistID = prompt("Enter your Github GistID:");

        if (!modalgistID) return;
        setGistID(modalgistID);

        try {
            await githubVerify(accounts[0], gistID);
            alert(`Success: you've verified ${handle}!`);
        } catch (error) {
            alert(error);
        }
    };

    const getValue = async (e: { target: { value: string } }) => {
        setHandle(e.target.value);
    };

    return (
        <>
            <Modal
                overlayOpacity={0.55}
                overlayBlur={3}
                centered
                opened={githubopened}
                onClose={() => setGithubOpened(false)}
            >
                <div className={styles.totalModalDiv}>
                    <p className={styles.modalTitle}>Verify Github Account</p>
                    <div className={styles.step1Section}>
                        <div className={styles.step1Title}>
                            <p className={styles.step1P}>Step1</p>
                        </div>
                        <div className={styles.step1MainSection}>
                            <p className={styles.step1MainP}>
                                Click this button to copy the verification
                                message.
                            </p>
                            <div
                                className={styles.step1CopySection}
                                onClick={() => githubVerifyMessageClick()}
                            >
                                <p className={styles.step1P}>Copy</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.step2Section}>
                        <div className={styles.step2Title}>
                            <p className={styles.step2P}>Step2</p>
                        </div>
                        <div className={styles.step2MainSection}>
                            <p className={styles.step1MainP}>
                                Click this button to open a new window and
                                create Gist file.
                            </p>
                            <div
                                className={styles.step2OpenSection}
                                onClick={() => githubOpenClick()}
                            >
                                <p className={styles.step1P}>Open</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.step3Section}>
                        <div className={styles.step3Title}>
                            <p className={styles.step3P}>Step3</p>
                        </div>
                        <div className={styles.step3MainSection}>
                            <p className={styles.step1MainP}>
                                Paste your DID in the Gist and save as public.
                            </p>
                        </div>
                    </div>

                    <div className={styles.step4Section}>
                        <div className={styles.step4Title}>
                            <p className={styles.step4P}>Step4</p>
                        </div>
                        <div className={styles.step4MainSection}>
                            <p className={styles.step1MainP}>
                                Return to this page and verify your account by
                                clicking this button.
                            </p>
                            <div
                                className={styles.step4VerifySection}
                                onClick={() => githubVerifyClick()}
                            >
                                <p className={styles.step1P}>Verify</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                overlayOpacity={0.55}
                overlayBlur={3}
                size="sm"
                centered
                opened={twitteropened}
                onClose={() => setTwitterOpened(false)}
            >
                <div className={styles.totalModalDiv}>
                    <p className={styles.modalTitle}>Sign message</p>
                    <p className={styles.modalMainP}>
                        Sign and tweet a message that will be used to link your
                        wallet address and Twitter handle.
                    </p>
                    <div className={styles.walletModalDiv}>
                        <div className={styles.addressSection}>
                            <img
                                src={"/Sample_User_Icon.png"}
                                className={styles.avatar}
                            />
                            <p className={styles.walletAddressModalP}>
                                {formatAddress(address)}
                            </p>
                        </div>
                        <div>
                            <p className={styles.modalunverifiedP}>
                                Unverified
                            </p>
                        </div>
                    </div>
                    <div className={styles.twitterHandleDiv}>
                        <input
                            id={"twitterInput"}
                            placeholder={"Your Twitter Handle"}
                            className={styles.inputStyle}
                            onChange={getValue}
                        />
                    </div>
                    <div className={styles.signButtonDiv}>
                        <div
                            className={styles.signButtonStyle}
                            onClick={() => tweetButtonClick()}
                        >
                            Tweet Message
                        </div>
                        <div
                            className={styles.verifyButtonStyle}
                            onClick={() => twitterVerifyClick()}
                        >
                            Verify Twitter
                        </div>
                    </div>
                </div>
            </Modal>
            {socialData.identity && (
                <div className={styles.socialSection}>
                    {socialData.identity.twitter.verified == true && (
                        <div className={styles.twitter}>
                            <div className={styles.twitterImageDiv}>
                                <img
                                    src={"/twitter.png"}
                                    alt={""}
                                    className={styles.twitterImage}
                                />
                                <img
                                    src={"/carbon_overflow-menu-vertical.png"}
                                    alt={""}
                                    className={styles.twitterImage}
                                />
                            </div>
                            <div className={styles.twitterPDiv}>
                                <p>Twitter</p>
                                <a
                                    href={
                                        "https://twitter.com/" +
                                        socialData.identity.handle
                                    }
                                >
                                    {"@" + socialData.identity.twitter.handle}
                                </a>
                            </div>
                            <div className={styles.verifyDiv}>
                                <img
                                    src={"/veirify_icon.png"}
                                    alt={""}
                                    className={styles.twitterImage}
                                />
                                <p className={styles.verifiedP}>Verified</p>
                            </div>
                        </div>
                    )}
                    {socialData.identity.twitter.verified == false && (
                        <div className={styles.twitter}>
                            <div className={styles.twitterImageDiv}>
                                <img
                                    src={"/twitter.png"}
                                    alt={""}
                                    className={styles.twitterImage}
                                />
                                <img
                                    src={"/carbon_overflow-menu-vertical.png"}
                                    alt={""}
                                    className={styles.twitterImage}
                                />
                            </div>
                            <div className={styles.twitterPDiv}>
                                <p>Twitter</p>
                                <a
                                    href={
                                        "https://twitter.com/" +
                                        socialData.identity.twitter.handle
                                    }
                                >
                                    No Name
                                </a>
                            </div>
                            <div
                                className={styles.verifyDiv}
                                onClick={() => setTwitterOpened(true)}
                            >
                                <p className={styles.unverifiedP}>Unverified</p>
                            </div>
                        </div>
                    )}

                    {socialData.identity.github.username ? (
                        <div className={styles.github}>
                            <div className={styles.twitterImageDiv}>
                                <img
                                    src={"/github_icon.png"}
                                    alt={""}
                                    className={styles.twitterImage}
                                />
                                <img
                                    src={"/carbon_overflow-menu-vertical.png"}
                                    alt={""}
                                    className={styles.twitterImage}
                                />
                            </div>
                            <div className={styles.twitterPDiv}>
                                <p>Github</p>
                                <a
                                    href={
                                        "https://github.com/" +
                                        socialData.identity.github.username
                                    }
                                >
                                    {"@" + socialData.identity.github.username}
                                </a>
                            </div>
                            <div className={styles.verifyDiv}>
                                <img
                                    src={"/veirify_icon.png"}
                                    alt={""}
                                    className={styles.twitterImage}
                                />
                                <p className={styles.verifiedP}>Verified</p>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.github}>
                            <div className={styles.twitterImageDiv}>
                                <img
                                    src={"/github_icon.png"}
                                    alt={""}
                                    className={styles.twitterImage}
                                />
                                <img
                                    src={"/carbon_overflow-menu-vertical.png"}
                                    alt={""}
                                    className={styles.twitterImage}
                                />
                            </div>
                            <div className={styles.twitterPDiv}>
                                <p>Github</p>
                            </div>
                            <div
                                className={styles.verifyDiv}
                                onClick={() => setGithubOpened(true)}
                            >
                                <p className={styles.unverifiedP}>
                                    Github Verify
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};
