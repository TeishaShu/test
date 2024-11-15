import React, { useState, useEffect, Fragment } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Input,
  Form,
  Checkbox,
  Button,
  Result,
} from 'antd';
import styles from '@/style/style.less';
import ComTextIcon from '../../components/ComTextIcon';
import valid from '@/fn/valid';

const FormIsOursPrepaidSetting = props => {
  const {
    form,
    isEdit,
    showRemoveConfirm,
  } = props;

  return (
    <Row gutter={[64, 0]}>
      <Col xs={24}>
        <Form.List
          name="prepaid"
        >
          {(fields, { add, remove }) => {
            let arr = form.getFieldValue().prepaid;

            return (
              <table
                className={styles.formTable}
              >
                <thead>
                  <tr>
                    <th>合約編號</th>
                    <th>作者</th>
                    <th>權利</th>
                    <th>{(isEdit) ? ('金額') : ('預付')}</th>
                    <th>已支付</th>
                    <th>不扣佣</th>
                    <th>限扣此專輯</th>
                    <th style={{ display: (isEdit) ? ('none') : ('table-cell') }}>餘額</th>
                    <th style={{ display: (isEdit) ? ('none') : ('table-cell') }}>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    (!form.getFieldsValue().prepaid || (form.getFieldsValue().prepaid && form.getFieldsValue().prepaid.length == 0)) && (
                      <tr>
                        <td colSpan="9">
                          <Result
                            status="warning"
                            title="查無資料"
                          />
                        </td>
                      </tr>
                    )
                  }
                  {fields.map((field, idx) => {
                    let arrOrgPrepaidList = form.getFieldsValue().prepaid;
                    let itemIsHistory = (arrOrgPrepaidList[idx] && arrOrgPrepaidList[idx].is_effective != '1') ? (styles.om_bg_gray) : ('');
                    let itemIsSettled = (arrOrgPrepaidList[idx] && arrOrgPrepaidList[idx].is_settled == '1') ? (true) : (false);

                    return (
                      <Fragment key={`tr_prepaid_${field.key}`}>
                        <tr>
                          <td className={itemIsHistory}>
                            <Form.Item shouldUpdate>
                              {() => {
                                let arrPrepaidList = form.getFieldsValue().prepaid;
                                return (
                                  <Fragment>
                                    <ComTextIcon text="實" isChecked={(arrPrepaidList[idx] && arrPrepaidList[idx].is_entity) ? true : false} />
                                    <ComTextIcon text="數" isChecked={(arrPrepaidList[idx] && arrPrepaidList[idx].is_digital) ? true : false} />
                                    {(arrPrepaidList[idx] && arrPrepaidList[idx].contract_song_code) ? arrPrepaidList[idx].contract_song_code : ''}
                                  </Fragment>
                                )
                              }}
                            </Form.Item>
                          </td>
                          <td className={itemIsHistory}>
                            <Form.Item shouldUpdate>
                              {() => {
                                let arrPrepaidList = form.getFieldsValue().prepaid;
                                return (arrPrepaidList[idx] && arrPrepaidList[idx].author) ? arrPrepaidList[idx].author : '';
                              }}
                            </Form.Item>
                          </td>
                          <td className={itemIsHistory}>
                            <Form.Item shouldUpdate>
                              {() => {
                                let arrPrepaidList = form.getFieldsValue().prepaid;
                                return (arrPrepaidList[idx] && arrPrepaidList[idx].song_rights) ? arrPrepaidList[idx].song_rights : '';
                              }}
                            </Form.Item>
                          </td>
                          <td className={itemIsHistory}>
                            {
                              (itemIsSettled)
                                ? (
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'balance']}
                                    fieldKey={[field.fieldKey, 'balance']}
                                    key={`balance_${field.fieldKey}`}
                                    initialValue=""
                                    style={{ display: (isEdit && arr[idx]) ? ('flex') : ('none') }}
                                    rules={[
                                      {
                                        validator(rule, values, callback) {
                                          let arrPrepaidList = form.getFieldsValue().prepaid;

                                          if (!itemIsHistory && values && arrPrepaidList[idx] && arrPrepaidList[idx].prepaid_id && (!valid.checkPostiveNumber(values) || isNaN(parseFloat(arrPrepaidList[idx]['balance'])) || parseFloat(arrPrepaidList[idx]['balance']) < 0)) {
                                            callback('金額須數字且大於等於 0');
                                          } else {
                                            callback();
                                          }
                                        }
                                      }
                                    ]}
                                  >
                                    <Input
                                      disabled={(itemIsHistory) ? (true) : (false)}
                                    />
                                  </Form.Item>
                                )
                                : (
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'value']}
                                    fieldKey={[field.fieldKey, 'value']}
                                    key={`value_${field.fieldKey}`}
                                    initialValue=""
                                    style={{ display: (isEdit && arr[idx]) ? ('flex') : ('none') }}
                                    rules={[
                                      {
                                        validator(rule, values, callback) {
                                          let arrPrepaidList = form.getFieldsValue().prepaid;

                                          if (!itemIsHistory && arrPrepaidList[idx] && arrPrepaidList[idx].prepaid_id && (!valid.checkPostiveNumber(values) || isNaN(parseFloat(arrPrepaidList[idx]['value'])) || parseFloat(arrPrepaidList[idx]['value']) <= 0)) {
                                            callback('已設定預付，金額為必填且須大於 0');
                                          } else {
                                            callback();
                                          }
                                        }
                                      }
                                    ]}
                                  >
                                    <Input
                                      disabled={(itemIsHistory) ? (true) : (false)}
                                    />
                                  </Form.Item>
                                )
                            }
                            {
                              (!isEdit) && (
                                <Form.Item
                                  shouldUpdate
                                >
                                  {() => {
                                    let arrPrepaidList = form.getFieldsValue().prepaid;
                                    return (arrPrepaidList[idx] && arrPrepaidList[idx].value) ? arrPrepaidList[idx].value : '';
                                  }}
                                </Form.Item>
                              )
                            }
                          </td>
                          <td className={itemIsHistory}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'is_paid']}
                              fieldKey={[field.fieldKey, 'is_paid']}
                              key={`is_paid_${field.fieldKey}`}
                              className={styles.om_dis_inlinebl}
                              valuePropName="checked"
                              rules={[
                                {
                                  validator(rule, values, callback) {
                                    let arrPrepaidList = form.getFieldsValue().prepaid;

                                    if (!itemIsHistory && !itemIsSettled && values && (isNaN(parseFloat(arrPrepaidList[idx]['value'])) || parseFloat(arrPrepaidList[idx]['value']) <= 0)) {
                                      callback('須設定金額且大於 0 才可勾選');
                                    } else {
                                      callback();
                                    }
                                  }
                                }
                              ]}
                              dependencies={[['prepaid', idx, 'value']]}
                            >
                              <Checkbox
                                disabled={
                                  (isEdit)
                                    ? (
                                      (!itemIsHistory && !itemIsSettled) ? (false) : (true)
                                    )
                                    : (true)
                                }
                              />
                            </Form.Item>
                          </td>
                          <td className={itemIsHistory}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'is_no_commission']}
                              fieldKey={[field.fieldKey, 'is_no_commission']}
                              key={`is_no_commission_${field.fieldKey}`}
                              className={styles.om_dis_inlinebl}
                              valuePropName="checked"
                              rules={[
                                {
                                  validator(rule, values, callback) {
                                    let arrPrepaidList = form.getFieldsValue().prepaid;

                                    if (!itemIsHistory && !itemIsSettled && values && (isNaN(parseFloat(arrPrepaidList[idx]['value'])) || parseFloat(arrPrepaidList[idx]['value']) <= 0)) {
                                      callback('須設定金額且大於 0 才可勾選');
                                    } else {
                                      callback();
                                    }
                                  }
                                }
                              ]}
                              dependencies={[['prepaid', idx, 'value']]}
                            >
                              <Checkbox
                                disabled={
                                  (isEdit)
                                    ? (
                                      (!itemIsHistory && !itemIsSettled) ? (false) : (true)
                                    )
                                    : (true)
                                }
                              />
                            </Form.Item>
                          </td>
                          <td className={itemIsHistory}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'is_limited']}
                              fieldKey={[field.fieldKey, 'is_limited']}
                              key={`is_limited_${field.fieldKey}`}
                              className={styles.om_dis_inlinebl}
                              valuePropName="checked"
                              rules={[
                                {
                                  validator(rule, values, callback) {
                                    let arrPrepaidList = form.getFieldsValue().prepaid;

                                    if (!itemIsHistory && !itemIsSettled && values && (isNaN(parseFloat(arrPrepaidList[idx]['value'])) || parseFloat(arrPrepaidList[idx]['value']) <= 0)) {
                                      callback('須設定金額且大於 0 才可勾選');
                                    } else {
                                      callback();
                                    }
                                  }
                                }
                              ]}
                              dependencies={[['prepaid', idx, 'value']]}
                            >
                              <Checkbox
                                disabled={
                                  (isEdit)
                                    ? (
                                      (!itemIsHistory && !itemIsSettled) ? (false) : (true)
                                    )
                                    : (true)
                                }
                              />
                            </Form.Item>
                          </td>
                          <td
                            className={itemIsHistory}
                            style={{ display: (isEdit) ? ('none') : ('table-cell') }}
                          >
                            <Form.Item shouldUpdate>
                              {() => {
                                let arrPrepaidList = form.getFieldsValue().prepaid;
                                return (arrPrepaidList[idx] && arrPrepaidList[idx].balance) ? (arrPrepaidList[idx].balance) : ('');
                              }}
                            </Form.Item>
                          </td>
                          <td
                            className={itemIsHistory}
                            style={{ display: (isEdit) ? ('none') : ('table-cell') }}
                          >
                            <Form.Item shouldUpdate>
                              {() => {
                                let arrPrepaidList = form.getFieldsValue().prepaid;
                                return (
                                  (!itemIsHistory && !itemIsSettled && arrPrepaidList[idx] && arrPrepaidList[idx].prepaid_id)
                                    ? (
                                      <Button
                                        type="link"
                                        onClick={() => {
                                          showRemoveConfirm(arrPrepaidList[idx].prepaid_id);
                                        }}
                                      >
                                        <CloseOutlined className={`${styles.om_icon_style} ${styles.om_color_red}`} />
                                      </Button>
                                    )
                                    : ('')
                                );
                              }}
                            </Form.Item>
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            )
          }}
        </Form.List>
      </Col>
    </Row >
  );
}

export default FormIsOursPrepaidSetting;