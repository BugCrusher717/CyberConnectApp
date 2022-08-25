import { GET_NOTIFICATIONS } from "@/graphql/queries/get_notifications";
import { formatAddress } from "@/utils/helper";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

interface Props {
    address: string;
}

export const NotificationSection = ({ address }: Props) => {
    const [notificationData, setNotificationData] = useState<any>([]);

    const { data, refetch } = useQuery(GET_NOTIFICATIONS, {
        variables: {
            address: address,
        },
    });

    useEffect(() => {
        refetch();
        if (data) {
            setNotificationData(data.identity.notifications.list);
        }
    }, [data, refetch]);

    return (
        <div className={styles.allNotificationDiv}>
            {notificationData ? (
                notificationData.map(
                    (
                        value: {
                            fromAddress: string;
                            connectionType: string;
                        },
                        index: number
                    ) => {
                        return (
                            <div
                                key={index}
                                className={styles.emptynotificationSection}
                            >
                                <p className={styles.notificationMainP}>
                                    {formatAddress(value.fromAddress)}{" "}
                                    requesting to {value.connectionType} you
                                </p>
                            </div>
                        );
                    }
                )
            ) : (
                <div className={styles.emptynotificationSection}>
                    <p className={styles.notificationMainP}>
                        You have no notification, you can use another wallet
                        address to follow address
                    </p>
                </div>
            )}
        </div>
    );
};
