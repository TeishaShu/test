import React, { useState, useEffect, Fragment } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  Spin,
  InputNumber,
} from 'antd';
import { connect } from 'umi';
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import valid from '@/fn/valid';

const { Option } = Select;

export const ComRecordSplitEdit = props => {
  const {
    isEdit,
    isData,
    onOkForm,
    onCancelForm,
    authorIdList,
    setAuthorIdList,
    setViewLoading,
    companyIdList,
    setCompanyIdList,
    pageId,
    onSaveForm,
    dispatch,
    albumList: { info },
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [contractList, setContractList] = useState([]);
  // for author
  const [isFetching, setIsFetching] = useState(false);
  let timer;
  // for company
  const [isFetchingC, setIsFetchingC] = useState(false);
  let timerC;

  // api -----
  // searchOption (company)
  const searchOptionC = (keyword, idx) => {
    setIsFetching(true);
    clearTimeout(timerC);
    timerC = setTimeout(() => {
      commFn.searchOption(keyword, '/company/Auto', (res) => {
        let tmpCompanyList = companyIdList.slice();

        tmpCompanyList[idx] = res;
        setCompanyIdList(tmpCompanyList);
        setIsFetchingC(false);
      });
    }, 200);
  }

  // searchOption (author)
  const searchOption = (keyword, idx) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/author/author_name', (res) => {
        let tmpeAuthorIdList = authorIdList.slice();

        tmpeAuthorIdList[idx] = res;
        setAuthorIdList(tmpeAuthorIdList);
        setIsFetching(false);
      });
    }, 200);
  }

  // requestContractAuthor
  const requestContractAuthor = (author_id) => {
    return new Promise((resolve, reject) => {
      fetch(`${window.FRONTEND_WEB}/contract_author/contracts_belong_to_author?author_id=${author_id}&release_date=${info.release_date}`)
        .then(res => res.json())
        .then(jsonData => {
          resolve(
            (jsonData.data)
              ? (jsonData.data.filter((e) => {
                return e.contract_author && e.contract_author.is_delete == '0'
              }))
              : ([])
          );
        }).catch(err => {
          resolve([]);
        });
    });
  }

  const requestContractAuthorList = () => {
    setViewLoading(true);

    let urls = isData.split.map((elem) => (elem.author_id) ? (elem.author_id) : null);
    let requests = urls.map(url => requestContractAuthor(url));
    let tmpContractList = [];

    Promise.all(requests).then(res => {
      for (let m = 0; m < res.length; m++) {
        let tmpContractOpt = [];
        for (let n = 0; n < res[m].length; n++) {
          let tmpContractItem = {
            ...res[m][n],
            label: res[m][n].contract_author.contract_code,
            value: res[m][n].contract_author.id,
            subcontract_id: res[m][n].subcontract_id,
            parent_author_id: res[m][n].subcontract_parent_author_id,
          }
          tmpContractOpt.push(tmpContractItem);
        }
        tmpContractList.push(tmpContractOpt);
      }

      setContractList(tmpContractList);

      setViewLoading(false);
    });
  }

  // updateData
  useEffect(() => {
    if (isEdit) {
      requestContractAuthorList();

      form.setFieldsValue({
        ...isData,
      });
    }
  }, [isEdit]);

  const onFinish = values => {
    setError([]);

    let saveObj = {
      album_id: pageId,
      author: []
    };

    for (let i = 0; i < values.split.length; i++) {
      let tmpItem = {
        id: (values.split[i].author_id) ? (values.split[i].author_id) : null,
        numerator: values.split[i].numerator,
        denominator: values.split[i].denominator,
        contract_id: (values.split[i].contract_id) ? (values.split[i].contract_id) : null,
        company_id: (values.split[i].company_id) ? (values.split[i].company_id) : null,
        subcontract_id: (values.split[i].subcontract_id) ? (values.split[i].subcontract_id) : '',
        parent_author_id: (values.split[i].parent_author_id) ? (values.split[i].parent_author_id) : '',
      };

      saveObj.author.push(tmpItem);
    }

    onSaveForm(saveObj);
  }

  const onFinishFailed = errorInfo => {
    setError(errorInfo.errorFields);
  }

  // ui -----
  // confirm
  const showConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要取消修改嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        onCancelForm();
      },
      onCancel() { },
    });
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.List name="split">
        {(fields, { add, remove }) => {
          let arr = form.getFieldValue().split;
          let num = 0;

          return (
            <table
              className={styles.formTable}
            >
              <thead>
                <tr>
                  <th style={{ width: '250px' }}>結算人</th>
                  <th colSpan="3">比例</th>
                  <th style={{ width: '200px' }}>合約</th>
                  <th>結算對象</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, idx) => {
                  if (arr[idx] == undefined || arr[idx]['is_delete'] == undefined) {
                    num++;
                  }

                  return (
                    <tr
                      key={`split_${field.key}`}
                      style={(arr[idx] == undefined || arr[idx]['is_delete'] == undefined) ? {} : { display: 'none' }}
                    >
                      <td>
                        <Form.Item
                          {...field}
                          name={[field.name, 'author_id']}
                          fieldKey={[field.fieldKey, 'author_id']}
                          label=""
                          key={`author_id_${field.fieldKey}`}
                          rules={[
                            {
                              required: true,
                              message: '此欄位為必填'
                            }
                          ]}
                        >
                          <Select
                            showSearch
                            optionFilterProp="children"
                            optionLabelProp="label"
                            filterOption={false}
                            allowClear={true}
                            notFoundContent={isFetching ? <Spin size="small" /> : null}
                            onSearch={(value) => {
                              searchOption(value, idx);
                            }}
                            onChange={(value, option) => {
                              let arrAddEdit = form.getFieldsValue().split.slice();

                              // author
                              arrAddEdit[idx].author_id = (option) ? (option.key) : '';
                              arrAddEdit[idx].author_name = (option) ? (option.label) : '';

                              // company
                              arrAddEdit[idx].company_id = '';
                              let tmpCompanyList = companyIdList.slice();
                              tmpCompanyList[idx] = [];
                              setCompanyIdList(tmpCompanyList);

                              // contract
                              arrAddEdit[idx].contract_id = '';
                              arrAddEdit[idx].subcontract_id = '';
                              arrAddEdit[idx].parent_author_id = '';

                              if (arr[idx] && arr[idx].id) {
                                arrAddEdit[idx]['is_edit'] = '1';
                              }
                              form.setFieldsValue({ split: arrAddEdit });

                              // update contract
                              if (option && option.key) {
                                setViewLoading(true);
                                requestContractAuthor(option.key).then((res) => {
                                  let tmpContractList = contractList.slice();
                                  let tmpContractOpt = res.map((cElem) => {
                                    return ({ ...cElem, value: cElem.contract_author.id, label: cElem.contract_author.contract_code });
                                  })
                                  tmpContractList[idx] = tmpContractOpt;
                                  setContractList(tmpContractList);

                                  setViewLoading(false);
                                });
                              } else {
                                let tmpContractList = contractList.slice();
                                tmpContractList[idx] = [];
                                setContractList(tmpContractList);
                              }
                            }}
                            onFocus={() => {
                              let tmpAuthorIdList = authorIdList.slice();

                              tmpAuthorIdList[idx] = [];
                              setAuthorIdList(tmpAuthorIdList);

                              if (form.getFieldValue()['split'][idx] && form.getFieldValue()['split'][idx]['author_name']) {
                                searchOption(form.getFieldValue()['split'][idx]['author_name'], idx);
                              }
                            }}
                            onSelect={(value, option) => {
                              searchOption(option.label, idx);
                            }}
                          >
                            {
                              (authorIdList && authorIdList[idx])
                                ? (
                                  authorIdList[idx].map(d => (
                                    <Option
                                      key={d.id}
                                      label={d.name}
                                      text={d.author_code}
                                      showtext={`${d.name} (${d.author_code})`}
                                    >
                                      {`${d.name} (${d.author_code})`}
                                    </Option>
                                  ))
                                )
                                : ([])
                            }
                          </Select>
                        </Form.Item>
                      </td>
                      <td style={{ width: '100px' }}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'numerator']}
                          fieldKey={[field.fieldKey, 'numerator']}
                          key={`split_numerator_${field.fieldKey}`}
                          initialValue=""
                          rules={[
                            {
                              required: true,
                              message: '此欄位為必填'
                            },
                            {
                              validator(rule, values, callback) {
                                if (!valid.checkPostiveNumber(values)) {
                                  callback(valid.checkPostiveNumber_msg);
                                } else {
                                  callback();
                                }
                              }
                            }
                          ]}
                        >
                          <InputNumber />
                        </Form.Item>
                      </td>
                      <td style={{ width: '20px', paddingLeft: 0, paddingRight: 0, textAlign: 'center' }}>
                        <Form.Item>
                          /
                        </Form.Item>
                      </td>
                      <td style={{ width: '100px' }}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'denominator']}
                          fieldKey={[field.fieldKey, 'denominator']}
                          key={`split_denominator_${field.fieldKey}`}
                          initialValue=""
                          rules={[
                            {
                              required: true,
                              message: '此欄位為必填'
                            },
                            {
                              validator(rule, values, callback) {
                                if (!valid.checkPostiveNumber(values)) {
                                  callback(valid.checkPostiveNumber_msg);
                                } else {
                                  callback();
                                }
                              }
                            }
                          ]}
                        >
                          <InputNumber />
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item
                          {...field}
                          name={[field.name, 'contract_id']}
                          fieldKey={[field.fieldKey, 'contract_id']}
                          key={`contract_id_${field.fieldKey}`}
                        >
                          <Select
                            options={contractList[idx]}
                            onChange={(value, option) => {
                              let arrAddEdit = form.getFieldsValue().split.slice();

                              arrAddEdit[idx].subcontract_id = (option.subcontract_id) ? (option.subcontract_id) : ('');
                              arrAddEdit[idx].parent_author_id = (option.parent_author_id) ? (option.parent_author_id) : ('');

                              form.setFieldsValue({ split: arrAddEdit });
                            }}
                          />
                        </Form.Item>

                      </td>
                      <td>
                        <Form.Item
                          {...field}
                          name={[field.name, 'company_id']}
                          fieldKey={[field.fieldKey, 'company_id']}
                          key={`split_company_id_${field.fieldKey}`}
                          initialValue=""
                        >
                          <Select
                            showSearch
                            optionFilterProp="children"
                            optionLabelProp="label"
                            filterOption={false}
                            allowClear={true}
                            notFoundContent={isFetchingC ? <Spin size="small" /> : null}
                            onSearch={(value) => {
                              searchOptionC(value, idx);
                            }}
                            onChange={(value, option) => {
                              // when click clearIcon, clear 'isList' data
                              if (!value) {
                                let tmpCompanyIdList = companyIdList.slice();
                                companyIdList[idx] = [];
                                setCompanyIdList(tmpCompanyIdList);
                              }

                              let arrAddEdit = form.getFieldsValue().split.slice();

                              arrAddEdit[idx].company_name = (option) ? (option.label) : '';
                              form.setFieldsValue({ split: arrAddEdit });
                            }}
                            onFocus={() => {
                              let tmpCompanyIdList = companyIdList.slice();
                              companyIdList[idx] = [];
                              setCompanyIdList(tmpCompanyIdList);
                              searchOptionC(form.getFieldValue().split[idx]['company_name'], idx);
                            }}
                            onSelect={(value, option) => {
                              searchOptionC(option.label, idx);
                            }}
                          >
                            {
                              (companyIdList && companyIdList[idx])
                                ? (
                                  companyIdList[idx].map(d => (
                                    <Option
                                      key={d.id}
                                      label={d.name}
                                      text={d.company_code}
                                    >
                                      {`${d.name} (${d.company_code})`}
                                    </Option>
                                  ))
                                )
                                : ([])
                            }
                          </Select>
                        </Form.Item>
                      </td>
                      <td className={styles.om_td_icon_style}>
                        <Form.Item>
                          <Button
                            type="link"
                            onClick={() => {
                              let tmpCompanyList = companyIdList.slice();
                              tmpCompanyList.splice(idx, 1);
                              setCompanyIdList(tmpCompanyList);

                              let tmpeAuthorIdList = authorIdList.slice();
                              tmpeAuthorIdList.splice(idx, 1);
                              setAuthorIdList(tmpeAuthorIdList);

                              remove(field.name);
                            }}
                          >
                            <CloseOutlined
                              className={`${styles.om_icon_btn_style} ${styles.om_color_red}`}
                            />
                          </Button>
                        </Form.Item>
                      </td>
                    </tr>
                  );
                })}
                <tr
                  className={styles.lastTr}
                >
                  <td colSpan="8">
                    <Button
                      type="dashed"
                      block
                      onClick={() => { add(); }}
                    >
                      <PlusOutlined />新增
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          );
        }}
      </Form.List>
      <Form.Item>
        <div style={{ float: 'right' }}>
          <Button
            className={styles.om_sp_m_lt}
            onClick={showConfirm}
          >取消</Button>
          <Button
            type="primary"
            className={`${styles.submitBtnWidth} ${styles.om_sp_m_lt}`}
            onClick={() => form?.submit()}
          >送出</Button>
        </div>
      </Form.Item>
    </Form>
  );
}


export default connect(({ albumList, loading }) => ({
  albumList,
}))(ComRecordSplitEdit);

