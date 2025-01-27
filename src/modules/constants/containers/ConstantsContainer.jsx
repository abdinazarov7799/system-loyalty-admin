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
    const [isModalOpen,setIsModalOpen] = useState(false);
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
        }
    ]

    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Row justify={"end"}>
                    <Button
                        icon={<EditOutlined />}
                        type={"primary"}
                        onClick={() => setIsModalOpen(true)}
                    >
                        {t("Edit")}
                    </Button>
                </Row>
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
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <EditConstants setIsModalOpen={setIsModalOpen} refetch={refetch} data={constants} id={get(data,'data.id',1)}/>
            </Modal>
        </Container>
    );
};

export default ConstantsContainer;
