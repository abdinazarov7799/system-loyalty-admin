import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, Image, Modal, Pagination, Popconfirm, Row, Space, Table} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import CreateEditAdmin from "../components/CreateEditPrizes.jsx";

const PrizesContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [itemData, setItemData] = useState(null);
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const {data,isLoading,isFetching} = usePaginateQuery({
        key: KEYS.prizes_list,
        url: URLS.prizes_list,
        params: {
            params: {
                size: 50,
            }
        },
        page
    });

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.prizes_list
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.prize_delete}/${id}`})
    }

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("Name uz"),
            dataIndex: "nameUz",
            key: "nameUz"
        },
        {
            title: t("Name ru"),
            dataIndex: "nameRu",
            key: "nameRu"
        },
        {
            title: t("Point"),
            dataIndex: "point",
            key: "point",
        },
        {
            title: t("Image"),
            key: "imageUrl",
            dataIndex: "imageUrl",
            width: 100,
            render: (props) => <Image src={props} width={80} height={50} />
        },
        {
            title: t("Edit / Delete"),
            width: 120,
            fixed: 'right',
            key: 'action',
            render: (props, data, index) => (
                <Space key={index}>
                    <Button icon={<EditOutlined />} onClick={() => {
                        setIsEditModalOpen(true)
                        setItemData(data)
                    }} />
                    <Popconfirm
                        title={t("Delete")}
                        description={t("Are you sure to delete?")}
                        onConfirm={() => useDelete(get(data,'id'))}
                        okText={t("Yes")}
                        cancelText={t("No")}
                    >
                        <Button danger icon={<DeleteOutlined />}/>
                    </Popconfirm>
                </Space>
            )
        }
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Button
                    icon={<PlusOutlined />}
                    type={"primary"}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    {t("New")}
                </Button>

                <Modal
                    title={t('Create new prize')}
                    open={isCreateModalOpenCreate}
                    onCancel={() => setIsCreateModalOpen(false)}
                    footer={null}
                >
                    <CreateEditAdmin setIsModalOpen={setIsCreateModalOpen}/>
                </Modal>
                <Modal
                    title={t("Edit prize")}
                    open={isEditModalOpen}
                    onCancel={() => setIsEditModalOpen(false)}
                    footer={null}
                >
                    <CreateEditAdmin
                        itemData={itemData}
                        setIsModalOpen={setIsEditModalOpen}
                    />
                </Modal>

                <Table
                    columns={columns}
                    dataSource={get(data,'data.content',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading || isFetching}
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

export default PrizesContainer;
