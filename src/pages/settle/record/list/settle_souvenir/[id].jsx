import React, { useState, useEffect, Fragment } from 'react';
import { PageHeaderWrapper, } from '@ant-design/pro-layout';
import {
    Spin,
    Card,
    Alert,
    Table, Tag, Space, Row, Col
} from 'antd';
import { connect } from 'umi';
import styles from '@/style/style.less';

export const SettleSouvenir = props => {
    const {
        settleMediaList,
        dispatch,
        settleAlbumList,
        loadingDate,
        loadingTable,
        enterpriseList,
        match,
    } = props;

    useEffect(() => {
        dispatch({
            type: 'settleAlbumList/fetchGetTwoSettleSouvenirApi',
            payload: {
                fetchGetPhaseList: {//settleMediaList.phaseList
                    type: '5',
                    routerId: match.params.id, // 到 reducers 判斷的
                    agent_eid: enterpriseList.agent_eid,
                },
                fetchGetSettleSouvenir: {
                    agent_eid: enterpriseList.agent_eid,
                    file_list_id: match.params.file_list,
                    sort: 'desc',
                    page_current: '1'
                }
            }
        })
    }, [])

    const columns = [
        {
            title: '產品編號',
            dataIndex: 'souvenir_code',
            key: 'souvenir_code',
            render: (text, row) => {
                return row.ui_show ? text : ""
            }
        },
        {
            title: '產品名稱',
            dataIndex: 'souvenir_name',
            key: 'souvenir_name',
            render: (text, row) => {
                return row.ui_show ? text : ""
            }
        },
        {
            title: '型態',
            dataIndex: 'souvenir_type',
            key: 'souvenir_type',
            render: (text, row) => {
                return row.ui_show ? text : ""
            }
        },
        {
            title: '首發日',
            dataIndex: 'souvenir_launch_day',
            key: 'souvenir_launch_day',
            render: (text, row) => {
                return row.ui_show ? text : ""
            }
        },
        {
            title: '售價',
            dataIndex: 'price',
            key: 'price',
            render: (text, row) => {
                return row.ui_show ? text : ""
            }
        },
        {
            title: '銷售量',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, row) => {
                return row.ui_show ? text : ""
            }
        },
        {
            title: '資料期別',
            dataIndex: 'data_phase',
            key: 'data_phase',
            render: (text, row) => {
                return row.ui_show ? text : ""
            }
        },
        {
            title: '藝人',
            dataIndex: 'author_name',
            key: 'author_name',
            className: styles.om_bd_l_dot,
        },
    ];

    const dataInfo = settleAlbumList.souvenirList;
    return (
        <Spin
            tip="Loading..."
            spinning={loadingDate || loadingTable}
        >
            <PageHeaderWrapper
                title="明星商品清單"
                content={`結算期別：${(settleMediaList.phaseList && settleMediaList.phaseList.id) ? (settleMediaList.phaseList.phase) : ""}`}
            >
                <Card bordered={false}>
                    <Row gutter={[0, 24]}>
                        <Col xs={24}>
                            {(dataInfo && dataInfo.summary) && (
                                <Alert message={`報表資料共 ${dataInfo.summary.total_items} 筆，金額：$${dataInfo.summary.total_price}`} type="info" showIcon />
                            )}
                        </Col>
                        <Col xs={24}
                            className={styles.om_overflow_auto}
                        >
                            {(dataInfo && dataInfo.data_list) && (
                                <Table
                                    columns={columns}
                                    dataSource={dataInfo.data_list}
                                    pagination={false}
                                    rowKey="ui_id"
                                />
                            )}
                        </Col>
                    </Row>
                </Card>
            </PageHeaderWrapper>
        </Spin>
    );
}

// export default Misc;settleAlbumList
export default connect(({ settleMediaList, settleAlbumList, loading, enterpriseList }) => ({
    settleMediaList,
    settleAlbumList,
    loadingDate: loading.models.settleMediaList,
    loadingTable: loading.models.settleAlbumList,
    enterpriseList
}))(SettleSouvenir);