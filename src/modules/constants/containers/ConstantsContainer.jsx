import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {get, isEqual} from "lodash";
import {Button, Modal, Pagination, Row, Space, Table} from "antd";
import {useTranslation} from "react-i18next";
import EditConstants from "../components/EditConstants.jsx";
import {EditOutlined} from "@ant-design/icons";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";

const ConstantsContainer = () => {
    const {t} = useTranslation();
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    const {data,isLoading,refetch} = usePaginateQuery({
        key: KEYS.constants_get_all,
        url: URLS.constants_get_all,
        params: {
            params: {
                size
            }
        },
        page
    })

    const columns = [
        {
            title: t("Key"),
            dataIndex: "key",
            key: "key",
        },
        {
            title: t("Value"),
            dataIndex: "value",
            key: "value",
        },
        {
            title: t("Edit"),
            dataIndex: "edit",
            key: "edit",
            render: (props,data) => (
                <Button icon={<EditOutlined />} onClick={() => {
                    setSelected(data)
                }} />
            )
        }
    ]

    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Table
                    columns={columns}
                    dataSource={get(data,'data.content')}
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
            <Modal
                title={t('Edit')}
                open={!!selected}
                onCancel={() => setSelected(null)}
                footer={null}
            >
                <EditConstants setSelected={setSelected} selected={selected} />
            </Modal>
        </Container>
    );
};

export default ConstantsContainer;
