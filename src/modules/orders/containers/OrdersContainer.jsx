import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Checkbox, Pagination, Row, Space, Table} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";

const OrdersContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.order_list,
        url: URLS.order_list,
        params: {
            params: {
                size: 10,
            }
        },
        page
    });

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("Prize name uz"),
            dataIndex: "prizeNameUz",
            key: "prizeNameUz"
        },
        {
            title: t("Prize name ru"),
            dataIndex: "prizeNameRu",
            key: "prizeNameRu",
        },
        {
            title: t("Chat id"),
            dataIndex: "chatId",
            key: "chatId",
        },
        {
            title: t("Phone number"),
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: t("Prize point"),
            dataIndex: "prizePoint",
            key: "prizePoint",
        },
        {
            title: t("Accepted"),
            dataIndex: "accepted",
            key: "accepted",
            render: (props, data) => {
                return <Checkbox value={props} disabled/>
            }
        },
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Table
                    columns={columns}
                    dataSource={get(data,'data.content',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
                />

                <Row justify={"end"} style={{marginTop: 10}}>
                    <Pagination
                        current={page+1}
                        onChange={(page) => setPage(page - 1)}
                        total={get(data,'data.totalPages') * 10 }
                        showSizeChanger={false}
                    />
                </Row>
            </Space>
        </Container>
    );
};

export default OrdersContainer;
