import React, { useState, useEffect } from 'react';
import {
  Spin,
  Button,
  Form,
  Card,
  Row,
  Modal,
  Popover,
  Col,
} from 'antd';
import { connect, history } from 'umi';
import ComInfo from './components/ComInfo';
import ComRight from './components/ComRight';
import ComRecord from './components/ComRecord';
import { CloseCircleOutlined } from "@ant-design/icons";
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import FooterToolbar from '@/components/FooterToolbar';
import errorStyles from '@/style/error_style.less';
import styles from '@/style/style.less';

export const Replace_settlement = props => {
  const {
    match,
    dispatch,
    loading,
    companyList: {
      info,
      changeId,
      ui_options_author,
    },
  } = props;
  const [form] = Form.useForm();
  const [newInfo, setNewInfo] = useState({ ...info });
  const [viewLoading, setViewLoading] = useState(false);
  const [error, setError] = useState([]);
  const { confirm } = Modal;

  // getData
  const getData = (pageId) => {
    dispatch({
      type: 'companyList/fetchGetInfo',
      payload: {
        id: pageId,
      },
    });
  }

  // mount
  useEffect(() => {
    getData(match.params.id);
  }, [match.params.id]);

  // update
  useEffect(() => {
    if (info && info.ui_replace_settle_right) {
      // AuthorCode 資料整理：ui_replace_settle_right
      let rightCode = [];
      info.ui_replace_settle_right.forEach(item => {
        if (item['author_code'] !== undefined) {
          rightCode.push(item['author_code'])
        }
      })

      // AuthorCode 資料整理：ui_replace_settle_record
      let recordCode = [];
      info.ui_replace_settle_record.forEach(item => {
        if (item['author_code'] !== undefined) {
          recordCode.push(item['author_code'])
        }
      })

      const objInfo = { ...info, ui_author_code_right: rightCode, ui_author_code_record: recordCode };

      // ui_contract_author_id
      objInfo.ui_replace_settle_record.forEach((uItem) => {
        uItem.ui_contract_author_id = uItem.content.map((elem) => elem.contract_author_id);
      });

      setNewInfo(objInfo)
      // init object
      form.setFieldsValue(objInfo);
    }
  }, [changeId]);

  const onFinishConversion = (originAry, typeNum) => {
    // 資料轉換 (is_edit、delete、no_commission 轉換、 add type)
    const filterAry = originAry.filter(item => {
      return (item['id'] && item['is_delete'] === "1") || (item['id'] && item['is_edit'] === "1") || (item['id'] === undefined);
    })
    filterAry.forEach((item, idx) => {
      item['no_commission'] = item['no_commission'] ? "1" : "0";
      item['type'] = typeNum;
    })

    if (typeNum === "2") {  // 適用合約-格式
      filterAry.forEach((item, idx) => {
        item.content = item.ui_option_selected;
      });
    }

    return filterAry;
  }

  const onFinish = values => {
    setError([]);
    const rightData = onFinishConversion(values.ui_replace_settle_right, '1');
    const recordData = onFinishConversion(values.ui_replace_settle_record, '2');
    let obj = {
      id: match.params.id,
      status: 'edit',
      data: [...rightData, ...recordData]
    };

    dispatch({
      type: 'companyList/fetchEditReplaceSettlement',
      payload: obj,
    });
  }

  const onFinishFailed = errorInfo => {
    setError(errorInfo.errorFields);
  }
  // valid
  // fieldLabels
  const fieldLabels = {
    percentage: '扣佣比例(%)',
    ui_contract_author_id: '適用合約',
  };
  const getErrorInfo = (errors, newInfo) => {
    const errorCount = errors.filter(item => item.errors.length > 0).length;

    if (!errors || errorCount === 0) {
      return null;
    }

    const scrollToField = fieldKey => {
      let labelNode = document.getElementById(fieldKey);

      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };

    const errorList = errors.map(err => {
      if (!err || err.errors.length === 0) {
        return null;
      }

      let groupName = err.name[0];
      let key = err.name[2];
      let renderFieldName = fieldLabels[key];

      if (key === "author_id") {
        renderFieldName = (groupName === 'ui_replace_settle_right') ? '適用作者' : '適用藝人'
      }

      if (err.name.length > 1) {
        key = err.name.join('_');
      }
      let renderSelector = key;

      return (
        <li key={key} className={errorStyles.errorListItem} onClick={() => scrollToField(renderSelector)}>
          <CloseCircleOutlined className={errorStyles.errorIcon} />
          <div className={errorStyles.errorMessage}>{err.errors[0]}</div>
          <div className={errorStyles.errorField}>{renderFieldName}</div>
        </li>
      );
    });
    return (
      <span className={errorStyles.errorIcon}>
        <Popover
          title="表單驗證訊息"
          content={errorList}
          overlayClassName={errorStyles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode;
            }

            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };

  // removePrepaid
  const showRemoveConfirm = (prepaidId) => {
    confirm({
      title: '',
      icon: '',
      content: '確定要刪除嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        let arr = form.getFieldValue();
        arr.replace_settle.forEach(item => {
          item['is_delete'] = '1'
        })
        let obj = {
          id: match.params.id,
          status: 'delete',
          data: [...arr.replace_settle]
        };

        dispatch({
          type: 'companyList/fetchEditReplaceSettlement',
          payload: obj,
        });
      },
      onCancel() { },
    });
  }

  // CancelConfirm
  const showCancelConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要取消修改嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        const id = match.params.id;
        history.push(`/information/company/adv/${id}/info`);
      },
      onCancel() { },
    });
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loading || viewLoading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <PageHeaderWrapper
          title='代結算設定'
          extra={(<Button onClick={showRemoveConfirm}>刪除</Button>)}
        >
          {/* 基本資料 */}
          <ComInfo info={info} />

          <Card
            bordered={false}
            className={`${styles.card} ${styles.titleNoBBd} ${styles.cardBodyNoBPd}`}
            title="代結算內容"
          >
            <Row gutter={[8, 0]}>
              <Col xs={24}>
                {/* 詞曲 */}
                {(newInfo && newInfo.ui_replace_settle_right) && (
                  <ComRight
                    form={form}
                    info={newInfo}
                    changeId={changeId}
                    getErrorInfo={getErrorInfo(error, newInfo)}
                  />
                )}
              </Col>
              <Col xs={24}>
                {/* 錄音 */}
                {(newInfo && newInfo.ui_replace_settle_record) && (
                  <ComRecord
                    form={form}
                    info={newInfo}
                    changeId={changeId}
                    ui_options_author={ui_options_author}
                    setViewLoading={setViewLoading}
                    getErrorInfo={getErrorInfo(error)}
                  />
                )}
              </Col>
            </Row>
          </Card>
        </PageHeaderWrapper>

        <FooterToolbar>
          {getErrorInfo(error)}
          <Button
            onClick={showCancelConfirm}
          >取消</Button>
          <Button
            type="primary"
            className={styles.submitBtnWidth}
            htmlType="submit"
          >送出</Button>
        </FooterToolbar>
      </Form>
    </Spin>
  )
}

export default connect(({ companyList, loading }) => ({
  companyList,
  loading: loading.models.companyList,
}))(Replace_settlement);
