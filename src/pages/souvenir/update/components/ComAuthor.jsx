import React, { useState, useEffect, Fragment } from 'react';
import {
  Form,
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Spin,
  InputNumber,
} from 'antd';
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import valid from '@/fn/valid';

const { Option } = Select;

const ComAuthor = props => {
  const {
    form,
    fieldLabels,
    setViewLoading,
    authorIdList,
    setAuthorIdList,
    contractList,
    setContractList,
    requestContractAuthor,
    dateFormat,
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  const searchOption = (keyword, idx) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/author/author_stage', (res) => {
        let tmpeAuthorIdList = authorIdList.slice();

        tmpeAuthorIdList[idx] = res;
        setAuthorIdList(tmpeAuthorIdList);
        setIsFetching(false);
      }, [{ key: 'group', value: '1' }]);
    }, 200);
  }

  return (
    <Card
      bordered={false}
      className={styles.card}
      title="拆分比例"
    >
      <Row>
        <Col
          xs={24}
          className={styles.om_overflow_auto}
        >
          <Form.List
            name="author"
          >
            {(fields, { add, remove }) => {
              let arr = form.getFieldValue()['author'];

              return (
                <table
                  id="split_table"
                  className={styles.formTable}
                >
                  <thead>
                    <tr>
                      <th>藝名</th>
                      <th>&nbsp;</th>
                      <th colSpan="3">比例</th>
                      <th>適用合約</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, idx) => {
                      return (
                        <tr
                          key={`author_${field.key}`}
                          style={(arr[idx] == undefined || arr[idx]['is_delete'] == undefined || arr[idx]['is_delete'] == '0') ? {} : { display: 'none' }}
                        >
                          <td style={{ width: '350px' }}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'author_stage_name_id']}
                              fieldKey={[field.fieldKey, 'author_stage_name_id']}
                              label={fieldLabels.author_stage_name_id}
                              className={styles.om_hide_label}
                              key={`author_stage_name_id_${field.fieldKey}`}
                              initialValue=""
                              rules={[
                                {
                                  validator(rule, values, callback) {
                                    let result = (form.getFieldValue().author[idx]['is_delete'] == '1') ? (true) : valid.checkRequired(values);

                                    if (result != false) {
                                      callback();
                                    } else {
                                      callback(valid.checkRequired_msg);
                                    }
                                  }
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
                                  let arrAddEdit = form.getFieldsValue().author.slice();

                                  // author
                                  arrAddEdit[idx].author_id = (option) ? (option.authorid) : '';
                                  arrAddEdit[idx].author_name = (option) ? (option.label) : '';
                                  arrAddEdit[idx].author_code = (option) ? (option.text) : '';

                                  // contract
                                  arrAddEdit[idx].contract_author_id = '';
                                  arrAddEdit[idx].subcontract_id = '';

                                  if (arr[idx] && arr[idx].souvenir_split_ratio_id) {
                                    arrAddEdit[idx]['is_edit'] = '1';
                                  }
                                  form.setFieldsValue({ author: arrAddEdit });

                                  // update contract
                                  if (option && option.authorid && valid.checkDateRequired(form.getFieldsValue()['souvenir']['souvenir_launch_day'])) {
                                    setViewLoading(true);

                                    requestContractAuthor(option.authorid, form.getFieldsValue()['souvenir']['souvenir_launch_day'].format(dateFormat)).then((res) => {
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

                                  if (form.getFieldValue()['author'][idx] && form.getFieldValue()['author'][idx]['author_name']) {
                                    searchOption(form.getFieldValue()['author'][idx]['author_name'], idx);
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
                                          label={d.stage_name}
                                          authorid={d.author_id}
                                          text={d.author_code}
                                          showtext={`${d.stage_name} (${d.author_code})`}
                                        >
                                          {`${d.stage_name} (${d.author_code})`}
                                        </Option>
                                      ))
                                    )
                                    : ([])
                                }
                              </Select>
                            </Form.Item>
                          </td>
                          <td style={{ width: '100px' }}>
                            <Form.Item shouldUpdate>
                              {() => {
                                let arrOriginList = form.getFieldsValue().author;
                                return (arrOriginList[idx] && arrOriginList[idx].author_code) ? arrOriginList[idx].author_code : '';
                              }}
                            </Form.Item>
                          </td>
                          <td style={{ width: '100px' }}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'numerator']}
                              fieldKey={[field.fieldKey, 'numerator']}
                              label={fieldLabels.numerator}
                              className={styles.om_hide_label}
                              key={`author_numerator_${field.fieldKey}`}
                              initialValue=""
                              rules={[
                                {
                                  validator(rule, values, callback) {
                                    let result = (form.getFieldValue().author[idx]['is_delete'] == '1') ? (true) : valid.checkRequired(values);

                                    if (result != false) {
                                      callback();
                                    } else {
                                      callback(valid.checkRequired_msg);
                                    }
                                  }
                                },
                                {
                                  validator(rule, values, callback) {
                                    let result = (form.getFieldValue().author[idx]['is_delete'] == '1') ? (true) : valid.checkPostiveNumber(values);
                                    if (!result) {
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
                              label={fieldLabels.denominator}
                              className={styles.om_hide_label}
                              key={`author_denominator_${field.fieldKey}`}
                              initialValue=""
                              min={0}
                              rules={[
                                {
                                  validator(rule, values, callback) {
                                    let result = (form.getFieldValue().author[idx]['is_delete'] == '1') ? (true) : valid.checkRequired(values);

                                    if (result) {
                                      callback();
                                    } else {
                                      callback(valid.checkRequired_msg);
                                    }
                                  }
                                },
                                {
                                  validator(rule, values, callback) {
                                    let result = (form.getFieldValue().author[idx]['is_delete'] == '1') ? (true) : valid.checkPostiveNumber(values);
                                    if (!result) {
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
                          <td
                            key={`author_e_${field.key}`}
                          >
                            <Form.Item
                              {...field}
                              name={[field.name, 'contract_author_id']}
                              fieldKey={[field.fieldKey, 'contract_author_id']}
                              key={`contract_author_id_${field.fieldKey}`}
                            >
                              <Select
                                options={contractList[idx]}
                                onChange={(val, option) => {
                                  let contractArr = form.getFieldValue().author.slice();

                                  if (option && option.subcontract_id) {
                                    contractArr[idx].subcontract_id = option.subcontract_id;
                                  } else {
                                    contractArr[idx].subcontract_id = '';
                                  }

                                  form.setFieldsValue({ author: contractArr });
                                }}
                              />
                            </Form.Item>
                          </td>
                          <td className={styles.om_td_icon_style}>
                            <Form.Item>
                              <Button
                                type="link"
                                onClick={() => {
                                  if (arr[idx] === undefined || arr[idx]['souvenir_split_ratio_id'] === undefined) {
                                    /*
                                    let tmpCompanyList = companyIdList.slice();
                                    tmpCompanyList.splice(idx, 1);
                                    setCompanyIdList(tmpCompanyList);
                                    */

                                    let tmpeAuthorIdList = authorIdList.slice();
                                    tmpeAuthorIdList.splice(idx, 1);
                                    setAuthorIdList(tmpeAuthorIdList);

                                    remove(field.name);
                                  } else {
                                    let delArr = form.getFieldValue().author.slice();
                                    delArr[idx]['is_delete'] = '1';
                                    form.setFieldsValue({ author: delArr });
                                  }
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
                    <tr>
                      <td colSpan="7">
                        <Button
                          type="dashed"
                          block
                          onClick={() => { add(); }}
                        >
                          <PlusOutlined />新增藝人
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              );
            }}
          </Form.List>
        </Col>
      </Row>
    </Card>
  );
}

export default ComAuthor;