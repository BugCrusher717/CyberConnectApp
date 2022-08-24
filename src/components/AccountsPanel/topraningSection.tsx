import { GET_TOPRANKING } from "@/graphql/queries/get_topranking";
import { formatAddress } from "@/utils/helper";
import { useQuery } from "@apollo/client";
import {
    Blockchain,
    Env,
    FollowButton
} from "@cyberconnect/react-follow-button";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

interface Props {
    address: string;
}

export const TopRankingSection = ({ address }: Props) => {
    const [topRankingData, setTopRankingData] = useState<any>([]);

    const { data, refetch } = useQuery(GET_TOPRANKING, {
        variables: {
            namespace: "CyberConnect",
            first: 50,
            after: "-1",
        },
    });

    useEffect(() => {
        refetch();
        if (data) {
            setTopRankingData(data.rankings.list);
        }
    }, [data, refetch]);

    

    return (
        <>
            {topRankingData &&
                topRankingData.map(
                    (
                        value: {
                            address: string;
                            avatar: string;
                            followerCount: string;
                        },
                        index: number
                    ) => {
                        return (
                            <div key={index} className={styles.userInfoSection}>
                                <div className={styles.avatarSection}>
                                    <div className={styles.avatarDiv}>
                                        {value.avatar ? (
                                            <img
                                                src={value.avatar}
                                                alt={""}
                                                className={styles.avatar}
                                            />
                                        ) : (
                                            <img
                                                src={"/Sample_User_Icon.png"}
                                                alt={""}
                                                className={styles.avatar}
                                            />
                                        )}
                                    </div>
                                    <div className={styles.userName}>
                                        <Typography
                                            variant="h6"
                                            paddingLeft={2}
                                            fontSize={13}
                                            sx={{
                                                color: "gray",
                                                fontFamily: "Outfit",
                                            }}
                                        >
                                            {formatAddress(value?.address)}
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            paddingLeft={2}
                                            fontSize={13}
                                            sx={{
                                                color: "gray",
                                                fontFamily: "Outfit",
                                            }}
                                        >
                                            {value?.followerCount}
                                        </Typography>
                                    </div>
                                </div>
                                <div className={styles.FollowButtonSection}>
                                    <FollowButton
                                        provider={window.ethereum}
                                        namespace="CyberGraph"
                                        toAddr={address}
                                        env={Env.PRODUCTION}
                                        chain={Blockchain.ETH}
                                        key={address}
                                    />
                                </div>
                            </div>
                        );
                    }
                )}
        </>
    );
};
