import globalSettings from '@/fn/globalsettings';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Pagination,
  Table,
  Alert,
} from 'antd';
import { Link, connect } from 'umi';
import PageHint from '@/components/PageHint';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const ComSongRights = props => {
  const {
    loading,
    dispatch,
    authorCode,
    songRightsList: { changeId, byAuthorList },
  } = props;
  const pageSize = globalSettings.pageSize;
  const [pageCurrent, setPageCurrent] = useState(1);

  // api -----
  // getData
  const getData = (obj) => {
    if (authorCode) {
      dispatch({
        type: 'songRightsList/fetchGetbyAuthorList',
        payload: {
          page_size: pageSize.toString(),
          page_current: (obj && obj.pageCurrent) ? obj.pageCurrent.toString() : pageCurrent.toString(),
          author_code: authorCode,
        },
      });
    }
  }

  // updateData
  useEffect(() => {
    setPageCurrent(1);
    getData({
      pageCurrent: 1,
    });
  }, [authorCode]);

  // ui -----
  // page
  const changePage = (page) => {
    let nowPage = parseInt(page);
    setPageCurrent(nowPage);
    getData({ pageCurrent: nowPage });
  }

  // table columns
  const columns = [
    {
      title: '歌曲編號',
      dataIndex: 'song_code',
      key: 'song_code',
      width: '10%',
      render: (text, row, index) => {
        return (<Link to={`/song/adv/id/${row.id}`}>{text}</Link>);
      },
    },
    {
      title: '顯示歌名',
      dataIndex: 'song_name',
      key: 'song_name',
      width: '20%',
    },
    {
      title: '英文歌名',
      dataIndex: 'song_name_en',
      key: 'song_name_en',
      width: '20%',
    },
    {
      title: '我方權利',
      dataIndex: 'default_company_rights',
      key: 'default_company_rights',
      width: '20%',
      render: (text, row, index) => {
        return `${(row.default_company_rights && row.default_company_rights.rights_num) ? (row.default_company_rights.rights_num) : ('0')}`;
      },
    },
    {
      title: 'ISWC',
      dataIndex: 'iswc',
      key: 'iswc',
      render: (text, row, index) => {
        return commFn.strToISWC(text);
      }
    },
  ];

  // expand table columns
  const expandColumns = [
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: '30%',
    },
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: '',
      dataIndex: 'rights_type',
      key: 'rights_type',
      width: '5%',
    },
    {
      title: '',
      dataIndex: 'rights_ratio',
      key: 'rights_ratio',
      width: '10%',
    },
    {
      title: '',
      dataIndex: 'contract_code',
      key: 'contract_code',
    },
  ];

  // expand table row (expandedRowRender)
  const expandedRowRender = (record, index) => {
    return (
      <Table
        className={styles.expandTable}
        columns={expandColumns}
        dataSource={record.rights_list}
        pagination={false}
        rowKey={(exRecord, exIndex) => `${exRecord.id}_ex_${exIndex}`}
        summary={pageData => {
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell>
              </Table.Summary.Cell>
              <Table.Summary.Cell
                colSpan="4"
                style={{ paddingLeft: '16px' }}
              >
                <Alert message={
                  (record.default_company_rights && record.default_company_rights.rights_num > 0)
                    ? (`我方權利 ${(record.default_company_rights.rights_num) ? (record.default_company_rights.rights_num) : ('0')} 筆，共 ${(record.default_company_rights.total_ratio) ? (record.default_company_rights.total_ratio) : ('0%')}，詞：${record.default_company_rights.lyrics_ratio.entity}(實) / ${record.default_company_rights.lyrics_ratio.digital}(數)，曲：${record.default_company_rights.tune_ratio.entity}(實) / ${record.default_company_rights.tune_ratio.digital}(數)`)
                    : (`我方權利 0 筆`)
                } />
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    );
  }

  return (
    <Fragment>
      <Card bordered={false}>
        <Row>
          <Col xs={24}>
            <Pagination
              className={styles.om_sp_m_lb}
              style={{ textAlign: 'right' }}
              current={pageCurrent}
              pageSize={pageSize}
              total={byAuthorList.total_items}
              onChange={changePage}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <PageHint
              totalItems={byAuthorList.total_items}
              pageSize={pageSize}
              changeId={changeId}
            />
          </Col>
        </Row>
        <Row>
          <Col
            xs={24}
            className={styles.om_overflow_auto}
          >
            <Table
              className={styles.mainTable}
              pagination={false}
              loading={loading}
              columns={columns}
              dataSource={byAuthorList.data_list}
              rowKey="id"
              expandable={{
                expandIconColumnIndex: 2,
                expandedRowRender: expandedRowRender,
                expandIcon: ({ expanded, onExpand, record }) =>
                  record.rights_list.length > 0 ? (
                    expanded ? (
                      <MinusCircleOutlined
                        style={{ fontSize: '20px' }}
                        onClick={e => onExpand(record, e)}
                      />
                    ) : (
                        <PlusCircleOutlined
                          style={{ fontSize: '20px' }}
                          onClick={e => onExpand(record, e)}
                        />
                      )
                  ) : ''
              }}
            />
          </Col>
        </Row>
      </Card>
    </Fragment>

  );
};

export default connect(({ songRightsList, loading }) => ({
  songRightsList,
  loading: loading.models.songRightsList,
}))(ComSongRights);