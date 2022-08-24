/* eslint-disable no-console */
import { GET_SOCIAL } from "@/graphql/queries/get_social";
import { formatAddress } from "@/utils/helper";
import { useQuery } from "@apollo/client";
import { twitterAuthorize, twitterVerify } from "@cyberlab/social-verifier";

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
    const { data, refetch } = useQuery(GET_SOCIAL, {
        variables: {
            address: address,
        },
    });

    useEffect(() => {
        refetch();
        if (data) {
            console.log(2);
            setsocialData(data);
        }
    }, [data, refetch]);

    const tweetButtonClick = async() =>{
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
          });
      
          // Check clause for handle
          if (!handle) return;
      
          // Generate the signature
          const sig = await twitterAuthorize(window.ethereum, accounts[0], handle);
      
          // The message that the user posts on Twitter
          const message = `Verifying my Web3 identity on @cyberconnecthq: %23LetsCyberConnect %0A ${sig}`;
      
          // Open new window so that the user can post on Twitter
          window.open(`https://twitter.com/intent/tweet?text=${message}`, "_blank");
    } 
    
    const twitterVerifyClick = async () => {
        // Get the MetaMask wallet address
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts"
        });
        
        if (!handle) return;
        
        // Verify the Twitter account
        try {
          await twitterVerify(accounts[0], handle);
          alert(`Success: you've verified ${handle}!`);
        } catch (error) {
          console.error("asfd:", error);
        }
        
    };

    const githubVerifyClick = async () => {
        // Get the MetaMask wallet address
        window.open(`https://github.com/${handle}`, "_blank");
    };

    const getValue = async (e: { target: { value: string } }) =>{
        setHandle(e.target.value);
    };
    return (
        <>  
            <Modal
                overlayOpacity={0.55}
                overlayBlur={3}
                size="sm"
                centered
                opened={githubopened}
                onClose={() => setGithubOpened(false)}
            >
                <div className={styles.totalModalDiv}>
                    <p className={styles.modalTitle}>Github</p>
                    <p className={styles.modalMainP}>Please write a Username</p>
                    <div className={styles.walletModalDiv}>
                        <div className={styles.addressSection}>
                            <img
                                src = {"/Sample_User_Icon.png"}
                                className= {styles.avatar}
                            />
                            <p className={styles.walletAddressModalP}>{formatAddress(address)}</p>
                        </div>  
                    </div>
                    <div className={styles.twitterHandleDiv}>
                        <input
                            id={"twitterInput"}
                            placeholder={"Your Username"}
                            className={styles.inputStyle}
                            onChange = {getValue}
                        />
                    </div>
                    <div className={styles.signButtonStyle} onClick={()=>githubVerifyClick()}>
                        Sign
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
                    <p className={styles.modalMainP}>Sign and tweet a message that will be used to link your wallet address and Twitter handle.</p>
                    <div className={styles.walletModalDiv}>
                        <div className={styles.addressSection}>
                            <img
                                src = {"/Sample_User_Icon.png"}
                                className= {styles.avatar}
                            />
                            <p className={styles.walletAddressModalP}>{formatAddress(address)}</p>
                        </div>  
                        <div>
                            <p className={styles.modalunverifiedP}>Unverified</p>
                        </div>
                    </div>
                    <div className={styles.twitterHandleDiv}>
                        <input
                            id={"twitterInput"}
                            placeholder={"Your Twitter Handle"}
                            className={styles.inputStyle}
                            onChange = {getValue}
                        />
                    </div>
                    <div className={styles.signButtonDiv}>
                        <div className={styles.signButtonStyle} onClick={()=>tweetButtonClick()}>
                            Tweet Message
                        </div>
                        <div className={styles.verifyButtonStyle} onClick={()=>twitterVerifyClick()}>
                            Verify Twitter
                        </div>
                    </div>

                </div>
            </Modal>

            <div className={styles.socialSection}>
                {socialData.identity &&
                    socialData.identity.twitter.verified == true && (
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
                {socialData.identity &&
                    socialData.identity.twitter.verified == false && (
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
                            <div className={styles.verifyDiv} onClick={()=>setTwitterOpened(true)}>
                                <p className={styles.unverifiedP}>Unverified</p>
                            </div>
                        </div>
                    )}
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
                    <div className={styles.twitterPDiv} >
                        <p>Github</p>
                    </div>
                    <div className={styles.verifyDiv} onClick={()=>setGithubOpened(true)}>
                        <p className={styles.unverifiedP}>Connect to Github</p>
                    </div>
                </div>
            </div>
        </>
    );
};
