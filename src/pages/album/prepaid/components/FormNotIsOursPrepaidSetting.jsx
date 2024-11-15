import React, { useState, useEffect, Fragment } from 'react';
import { MinusCircleOutlined, PlusCircleOutlined, CloseOutlined } from '@ant-design/icons';
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

const FormPrepaidSetting = props => {
  const {
    form,
    isEdit,
    setIsEdit,
    showRightList,
    setShowRightList,
    setIsDisabledSubmit,
    pageId,  // album_id
    showRemoveConfirm,
    dispatch,
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
                    {/* <th>不扣佣</th> */}
                    <th style={{ display: (isEdit) ? ('none') : ('table-cell') }}>餘額</th>
                    <th style={{ display: (isEdit) ? ('none') : ('table-cell') }}>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    (!form.getFieldsValue().prepaid || (form.getFieldsValue().prepaid && form.getFieldsValue().prepaid.length == 0)) && (
                      <tr>
                        <td colSpan="7">
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
                    let itemUiIsChild = (arrOrgPrepaidList[idx] && arrOrgPrepaidList[idx].ui_is_child) ? (true) : (false);

                    return (
                      <Fragment key={`tr_prepaid_${field.key}`}>
                        <tr>
                          <td className={itemIsHistory}>
                            <Form.Item shouldUpdate>
                              {() => {
                                let arrPrepaidList = form.getFieldsValue().prepaid;
                                return (
                                  <Fragment>
                                    {
                                      (arrPrepaidList[idx] && arrPrepaidList[idx].is_master)
                                        ? (<ComTextIcon text="主" isChecked={true} cusColor={'#F9B006'} />)
                                        : ('')
                                    }
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
                                    style={{ display: (isEdit) ? ('flex') : ('none') }}
                                    rules={[
                                      {
                                        validator(rule, values, callback) {
                                          let arrPrepaidList = form.getFieldsValue().prepaid;

                                          if (!itemIsHistory && !itemUiIsChild && arrPrepaidList[idx]['rights'] && arrPrepaidList[idx]['rights'].length > 0) {
                                            let isChecked = false;

                                            for (let i = 0; i < arrPrepaidList[idx]['rights'].length; i++) {
                                              if (arrPrepaidList[idx]['rights'][i]['checked']) {
                                                isChecked = true;
                                                break;
                                              }
                                            }

                                            if ((arrPrepaidList[idx].prepaid_id || isChecked) && (!valid.checkPostiveNumber(values) || isNaN(parseFloat(arrPrepaidList[idx]['balance'])) || parseFloat(arrPrepaidList[idx]['balance']) < 0)) {
                                              callback('金額須數字且大於等於 0');
                                            } else {
                                              callback();
                                            }
                                          } else {
                                            callback();
                                          }
                                        }
                                      }
                                    ]}
                                  >
                                    <Input
                                      disabled={(itemIsHistory || itemUiIsChild) ? (true) : (false)}
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
                                    style={{ display: (isEdit) ? ('flex') : ('none') }}
                                    rules={[
                                      {
                                        validator(rule, values, callback) {
                                          let arrPrepaidList = form.getFieldsValue().prepaid;

                                          if (!itemIsHistory && !itemUiIsChild && arrPrepaidList[idx]['rights'] && arrPrepaidList[idx]['rights'].length > 0) {
                                            let isChecked = false;

                                            for (let i = 0; i < arrPrepaidList[idx]['rights'].length; i++) {
                                              if (arrPrepaidList[idx]['rights'][i]['checked']) {
                                                isChecked = true;
                                                break;
                                              }
                                            }

                                            if ((arrPrepaidList[idx].prepaid_id || isChecked) && (!valid.checkPostiveNumber(values) || isNaN(parseFloat(arrPrepaidList[idx]['value'])) || parseFloat(arrPrepaidList[idx]['value']) <= 0)) {
                                              callback('已設定預付或勾選合併扣抵，金額為必填且須大於 0');
                                            } else {
                                              callback();
                                            }
                                          } else {
                                            callback();
                                          }
                                        }
                                      }
                                    ]}
                                  >
                                    <Input
                                      disabled={(itemIsHistory || itemUiIsChild) ? (true) : (false)}
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
                            >
                              <Checkbox
                                disabled={
                                  (isEdit)
                                    ? (
                                      (!itemIsHistory && !itemIsSettled && !itemUiIsChild) ? (false) : (true)
                                    )
                                    : (true)
                                }
                              />
                            </Form.Item>
                          </td>
                          {/* <td className={itemIsHistory}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'is_no_commission']}
                              fieldKey={[field.fieldKey, 'is_no_commission']}
                              key={`is_no_commission_${field.fieldKey}`}
                              className={styles.om_dis_inlinebl}
                              valuePropName="checked"
                            >
                              <Checkbox
                                disabled={
                                  (isEdit)
                                    ? (
                                      (!itemIsHistory && !itemIsSettled && !itemUiIsChild) ? (false) : (true)
                                    )
                                    : (true)
                                }
                              />
                            </Form.Item>
                          </td> */}
                          <td
                            className={itemIsHistory}
                            style={{ display: (isEdit) ? ('none') : ('table-cell') }}
                          >
                            <Form.Item shouldUpdate>
                              {() => {
                                let arrPrepaidList = form.getFieldsValue().prepaid;
                                return (arrPrepaidList[idx] && arrPrepaidList[idx].balance) ? arrPrepaidList[idx].balance : '';
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
                                  (!itemIsHistory && arrPrepaidList[idx] && !itemIsSettled && !itemUiIsChild && arrPrepaidList[idx].prepaid_id)
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
                        <tr
                          key={`tr_prepaid_2_${field.key}`}
                          style={{
                            display: (arr[idx]['rights'] && arr[idx]['rights'].length > 0) ? ('table-row') : ('none')
                          }}
                        >
                          <td
                            colSpan="8"
                            className={itemIsHistory}
                          >
                            <p
                              style={{ position: 'relative', cursor: 'pointer' }}
                              onClick={() => {
                                let tmpShowRightList = showRightList.slice();

                                tmpShowRightList[idx] = !tmpShowRightList[idx];
                                setShowRightList(tmpShowRightList);
                              }}
                            >
                              {
                                (showRightList[idx])
                                  ? (
                                    <Fragment>
                                      <MinusCircleOutlined
                                        style={{ position: 'absolute', fontSize: '20px' }}
                                      /><span style={{ paddingLeft: '25px' }}>合併扣抵</span>
                                    </Fragment>
                                  )
                                  : (
                                    <Fragment>
                                      <PlusCircleOutlined
                                        style={{ position: 'absolute', fontSize: '20px' }}
                                      /><span style={{ paddingLeft: '25px' }}>合併扣抵</span>
                                    </Fragment>
                                  )
                              }
                            </p>
                            <Form.List
                              name={[field.name, 'rights']}
                            >
                              {(rFields, { rAdd, rRemove }) => {
                                return (
                                  <table
                                    className={styles.formTable}
                                    style={{
                                      display: (showRightList[idx]) ? ('table') : ('none'),
                                      marginLeft: '50px',
                                      paddingRight: '50px'
                                    }}
                                  >
                                    <thead>
                                      <tr>
                                        <th className={itemIsHistory}></th>
                                        <th className={itemIsHistory}>專輯編號</th>
                                        <th className={itemIsHistory}>發行地區</th>
                                        <th className={itemIsHistory}>Disc</th>
                                        <th className={itemIsHistory}>歌曲名稱</th>
                                        <th className={itemIsHistory}>合約</th>
                                        <th className={itemIsHistory}>作者</th>
                                        <th className={itemIsHistory}>權利</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {
                                        rFields.map((rField, rIdx) => {
                                          let arrRightList = (form.getFieldsValue()['prepaid'][idx] && form.getFieldsValue()['prepaid'][idx]['rights']) ? (form.getFieldsValue()['prepaid'][idx]['rights']) : [];

                                          return (
                                            <tr key={`tr_rights_${rField.key}`}>
                                              <td className={itemIsHistory}>
                                                <Form.Item
                                                  {...rField}
                                                  name={[rField.name, 'checked']}
                                                  fieldKey={[rField.fieldKey, 'checked']}
                                                  key={`checked_${rField.fieldKey}`}
                                                  className={styles.om_dis_inlinebl}
                                                  valuePropName="checked"
                                                >
                                                  <Checkbox
                                                    disabled={
                                                      (isEdit)
                                                        ? (
                                                          (!itemIsHistory && !itemIsSettled && !itemUiIsChild && arrRightList[rIdx] && arrRightList[rIdx].is_effective == '1' && !arrRightList[rIdx].is_master) ? (false) : (true)
                                                        )
                                                        : (true)
                                                    }
                                                  />
                                                </Form.Item>
                                              </td>
                                              <td className={itemIsHistory}>
                                                <Form.Item shouldUpdate>
                                                  {() => {
                                                    let arrRightList = (form.getFieldsValue()['prepaid'][idx] && form.getFieldsValue()['prepaid'][idx]['rights']) ? (form.getFieldsValue()['prepaid'][idx]['rights']) : [];

                                                    return (
                                                      <Fragment>
                                                        {
                                                          (arrRightList[rIdx] && arrRightList[rIdx].is_master)
                                                            ? (<ComTextIcon text="主" isChecked={true} cusColor={'#F9B006'} />)
                                                            : ('')
                                                        }
                                                        {
                                                          (arrRightList[rIdx] && arrRightList[rIdx].album_code)
                                                            ? (arrRightList[rIdx].album_code)
                                                            : ('')
                                                        }
                                                      </Fragment>
                                                    );
                                                  }}
                                                </Form.Item>
                                              </td>
                                              <td className={itemIsHistory}>
                                                <Form.Item shouldUpdate>
                                                  {() => {
                                                    let arrRightList = (form.getFieldsValue()['prepaid'][idx] && form.getFieldsValue()['prepaid'][idx]['rights']) ? (form.getFieldsValue()['prepaid'][idx]['rights']) : ([]);
                                                    return (arrRightList[rIdx] && arrRightList[rIdx].country_name_zh) ? arrRightList[rIdx].country_name_zh : '';
                                                  }}
                                                </Form.Item>
                                              </td>
                                              <td className={itemIsHistory}>
                                                <Form.Item shouldUpdate>
                                                  {() => {
                                                    let arrRightList = (form.getFieldsValue()['prepaid'][idx] && form.getFieldsValue()['prepaid'][idx]['rights']) ? (form.getFieldsValue()['prepaid'][idx]['rights']) : ([]);
                                                    return (arrRightList[rIdx] && arrRightList[rIdx].disc) ? arrRightList[rIdx].disc : '';
                                                  }}
                                                </Form.Item>
                                              </td>
                                              <td className={itemIsHistory}>
                                                <Form.Item shouldUpdate>
                                                  {() => {
                                                    let arrRightList = (form.getFieldsValue()['prepaid'][idx] && form.getFieldsValue()['prepaid'][idx]['rights']) ? (form.getFieldsValue()['prepaid'][idx]['rights']) : ([]);
                                                    return (arrRightList[rIdx] && arrRightList[rIdx].song_name) ? arrRightList[rIdx].song_name : '';
                                                  }}
                                                </Form.Item>
                                              </td>
                                              <td className={itemIsHistory}>
                                                <Form.Item shouldUpdate>
                                                  {() => {
                                                    let arrRightList = (form.getFieldsValue()['prepaid'][idx] && form.getFieldsValue()['prepaid'][idx]['rights']) ? (form.getFieldsValue()['prepaid'][idx]['rights']) : ([]);
                                                    return (arrRightList[rIdx] && arrRightList[rIdx].contract_song_code) ? arrRightList[rIdx].contract_song_code : '';
                                                  }}
                                                </Form.Item>
                                              </td>
                                              <td className={itemIsHistory}>
                                                <Form.Item shouldUpdate>
                                                  {() => {
                                                    let arrRightList = (form.getFieldsValue()['prepaid'][idx] && form.getFieldsValue()['prepaid'][idx]['rights']) ? (form.getFieldsValue()['prepaid'][idx]['rights']) : ([]);
                                                    return (arrRightList[rIdx] && arrRightList[rIdx].author) ? arrRightList[rIdx].author : '';
                                                  }}
                                                </Form.Item>
                                              </td>
                                              <td className={itemIsHistory}>
                                                <Form.Item shouldUpdate>
                                                  {() => {
                                                    let arrRightList = (form.getFieldsValue()['prepaid'][idx] && form.getFieldsValue()['prepaid'][idx]['rights']) ? (form.getFieldsValue()['prepaid'][idx]['rights']) : ([]);
                                                    return (arrRightList[rIdx] && arrRightList[rIdx].song_rights) ? arrRightList[rIdx].song_rights : '';
                                                  }}
                                                </Form.Item>
                                              </td>
                                            </tr>
                                          );
                                        })
                                      }
                                    </tbody>
                                  </table>
                                )
                              }}
                            </Form.List>
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
    </Row>
  );
}

export default FormPrepaidSetting;