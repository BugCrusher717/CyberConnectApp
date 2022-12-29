/* eslint-disable no-console */
import { useGraph } from "@/context/GraphContext";
import { formatAddress } from "@/utils/helper";
import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FollowSections } from "./FollowSections";
import styles from "./index.module.css";
import { NftSections } from "./NftSections";
import { PoapsSections } from "./PoapsSections";
import { SocialSection } from './socialSection';

import { GET_SOCIAL } from "@/graphql/queries/get_social";

export const UserPanel: React.FC = () => {
    const { selectAddress, identity } = useGraph();
    const [nftCount, setNftCount] = useState(0);
    const [poapsCount, setPoapsCount] = useState(0);
    const [socialData, setsocialData] = useState<any>([]);
    const [verifiedCount, setVerifiedCount] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [followList, setFollowList] = useState<boolean>(false);
    const [nftList, showNftList] = useState<boolean>(true);
    const [poapsList, showPoapsList] = useState<boolean>(false);
    const [verifyList, showVerifyList] = useState<boolean>(false);
    const [listType, setListType] = useState(false);
    //fetch the user ether balance from ehterscan API

    const { data, refetch } = useQuery(GET_SOCIAL, {
        variables: {
            address: selectAddress,
        },
    });

    useEffect(() => {
        // (async () => {
            refetch();
            if (data) {
                // console.log(data.identity.github.username);
                console.log("data", data);
                setsocialData(data);
                console.log("Social Data", socialData);
                if(data.identity)
                {
                    
                    if(data.identity.github.username && data.identity.twitter.verified == true )
                    {
                        setVerifiedCount(2);
                    }

                    if(data.identity.github.username && data.identity.twitter.verified != true )
                    {
                        setVerifiedCount(1);
                    }
                    if(!data.identity.github.username && data.identity.twitter.verified == true )
                    {
                        setVerifiedCount(1);
                    }
                }
            }
        // })();
    }, [data]);
    
    useEffect(() => {
        (async () => {
            console.log(isLoading);
            setIsLoading(true);
            const NEXT_PUBLIC_ALCHEMY_ID = "ebVtfQPEno3FBoX0wc13m_SQUslqfywc";
            const res = await fetch(
                `https://eth-mainnet.alchemyapi.io/v2/${NEXT_PUBLIC_ALCHEMY_ID}/getNFTs/?owner=${selectAddress}`
            );

            let response;
            if (res.status === 200) {
                response = await res.json();
            }
            setNftCount(response.ownedNfts.length);
            setIsLoading(false);
        })();
    }, [selectAddress]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const res = await fetch(
                `https://api.poap.xyz/actions/scan/${selectAddress}`
            );
            let response;
            if (res.status === 200) {
                response = await res.json();
            }
            setPoapsCount(response.length);
            setIsLoading(false);
        })();
    }, [selectAddress]);

    return (
        <>
        {identity && (
            <div className={styles.container}>
                <div className={styles.avatarSection}>
                    {identity.avatar ? (
                        <a
                            rel="noreferrer"
                            href={
                                "https://app.cyberconnect.me/address/" +
                                identity?.address
                            }
                            target={"_blank"}
                        >
                            <img
                                src={identity.avatar}
                                alt={""}
                                width={60}
                                height={60}
                                className={styles.avatar}
                            />
                        </a>
                    ) : (
                        <a
                            rel="noreferrer"
                            href={
                                "https://app.cyberconnect.me/address/" +
                                identity?.address
                            }
                            target={"_blank"}
                        >
                            <img
                                src={"/Sample_User_Icon.png"}
                                alt={""}
                                width={60}
                                height={60}
                                className={styles.avatar}
                            />
                        </a>
                    )}
                    <p className={styles.addressP}>
                        {formatAddress(identity?.address)}
                    </p>
                </div>

                <div className={styles.countSection}>
                    <div className={styles.nftCountSection}>
                        <Typography
                            variant="h3"
                            sx={{
                                ":hover": {
                                    color: "#555",
                                    cursor: "pointer",
                                },
                            }}
                            onClick={() => [
                                setFollowList(false), //sets list modal to show followers
                                showNftList(true),
                                showPoapsList(false),
                                showVerifyList(false),
                            ]}
                        >
                            {nftCount}
                        </Typography>
                        <Typography color={"#989898"}>NFTs</Typography>
                    </div>
                    <div className={styles.connectionCountSection}>
                        <Typography
                            variant="h3"
                            sx={{
                                ":hover": {
                                    color: "#555",
                                    cursor: "pointer",
                                },
                            }}
                            onClick={() => [
                                showNftList(false), //sets list modal to show followers
                                setFollowList(true),
                                showPoapsList(false),
                                showVerifyList(false),
                            ]}
                        >
                            {Number(
                                identity.followerCount + identity.followingCount
                            )}
                        </Typography>
                        <Typography color={"#989898"}>Connections</Typography>
                    </div>
                    <div className={styles.poapsCountSection}>
                        <Typography
                            variant="h3"
                            sx={{
                                ":hover": {
                                    color: "#555",
                                    cursor: "pointer",
                                },
                            }}
                            onClick={() => [
                                setFollowList(false), //sets list modal to show followers
                                showNftList(false),
                                showPoapsList(true),
                                showVerifyList(false),
                            ]}
                        >
                            {poapsCount}
                        </Typography>
                        <Typography color={"#989898"}>POAPS</Typography>
                    </div>
                    <div className={styles.verifiedCountSection}>
                            <>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        ":hover": {
                                            color: "#555",
                                            cursor: "pointer",
                                        },
                                    }}
                                    onClick={() => [
                                        setFollowList(false), //sets list modal to show followers
                                        showPoapsList(false),
                                        showNftList(false),
                                        showVerifyList(true),
                                    ]}
                                >
                                    {verifiedCount}
                                </Typography>
                                <Typography color={"#989898"}>
                                    Verified ACCOUNTS
                                </Typography>
                            </>
                    </div>
                </div>
                {nftList == true && (
                    <>
                        {nftCount != 0 && (
                            <div className={styles.nftShowSecion}>
                                <NftSections />
                            </div>
                        )}
                        {nftCount == 0 && (
                            <div className={styles.noNftsInSection}>
                                <p>No NFTs</p>
                            </div>
                        )}
                    </>
                )}
                {followList == true && (
                    <>
                        <div className={styles.sectionButtonDiv}>
                            <div className={styles.followersButtonDiv} onClick={() => setListType(false)}>
                                <p
                                    className={styles.followersP}
                                   
                                >
                                    Followers
                                </p>
                            </div>
                            <div className={styles.followingButtonDiv} onClick={() => setListType(true)}>
                                <p
                                    className={styles.followingP}
                                    
                                >
                                    Following
                                </p>
                            </div>
                        </div>
                        <div className={styles.sectionWrapper}>
                            <FollowSections
                                address={selectAddress}
                                listType={listType}
                            />
                        </div>
                    </>
                )}
                {poapsList == true && (
                    <>
                        {poapsCount != 0 && (
                            <div className={styles.nftShowSecion}>
                                <PoapsSections />
                            </div>
                        )}
                        {poapsCount == 0 && (
                            <div className={styles.noNftsInSection}>
                                <p>NO POAPS</p>
                            </div>
                        )}
                    </>
                )}
                {verifyList == true && (
                    <>
                        {verifiedCount ? (
                            <SocialSection address={identity?.address} />
                        ):(
                            <div className={styles.noNftsInSection}>
                                <p>NO VerifiedAccount</p>
                            </div>
                        )}
                    </>
                )}
            </div>
            )}
        </>
    );
};

UserPanel.displayName = "UserPanel";
