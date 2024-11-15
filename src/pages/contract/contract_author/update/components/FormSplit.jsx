import React, { useState, useEffect, Fragment } from 'react';
import {
  Form,
  Select,
  Button,
  Input,
} from 'antd';

const { Option } = Select;

const FormSplit = props => {
  const {
    form,
    isGrayTag,
    isTd,
    isName,
    countryList,
  } = props;
  const tableStyle = {
    grayTagTd: {
      paddingTop: '15px',
      paddingBottom: '0',
      paddingLeft: '0',
      paddingRight: '0'
    },
    grayTagText: {
      padding: '5px',
      backgroundColor: '#D8D8D8',
      marginBottom: '0px',
      textAlign: 'center',
      fontWeight: '700',
      display: 'inline-block',
      width: '100px'
    },
    left1Td: {
      width: '300px',
      borderTop: '1.5px dotted #ECECEC',
      borderBottom: '1.5px dotted #ECECEC',
    },
    left2Td: {
      width: '150px',
      borderTop: '1.5px dotted #ECECEC',
      borderBottom: '1.5px dotted #ECECEC',
    },
    left3Td: {
      width: '150px',
      borderTop: '1.5px dotted #ECECEC',
      borderBottom: '1.5px dotted #ECECEC',
      borderRight: '1.5px dotted #ECECEC',
    },
    rightTd: {
      width: '500px',
      borderTop: '1.5px dotted #ECECEC',
      borderBottom: '1.5px dotted #ECECEC',
    },
  };

  return (
    <Fragment>
      <tr style={{ display: (isGrayTag) ? 'table-row' : 'none' }}>
        <td style={tableStyle.grayTagTd}>
          <p style={tableStyle.grayTagText}>{isGrayTag}</p>
        </td>
      </tr>
      <tr>
        <td id={isName}>
          <Form.Item>
            {isTd}
          </Form.Item>
        </td>
        <Form.List
          name={isName}
        >
          {(fields, { add, remove }) => {
            let listArr = form.getFieldsValue()[isName];
            let listNum = 0;

            return (
              <Fragment>
                {fields.map((field, idx) => {
                  if (idx == 0 || idx == 1) {
                    return (
                      <td
                        key={`${isName}_l_${idx}`}
                        style={(idx == 0) ? tableStyle.left2Td : tableStyle.left3Td}
                      >
                        <Form.Item
                          {...field}
                          name={[field.name, 'value']}
                          fieldKey={[field.fieldKey, 'country_id']}
                          label={(idx == 0 ? '台灣' : '其他地區')}
                          rules={[
                            {
                              validator(rule, values, callback) {
                                let result = true;
                                const valReg = /^\d{1,5}(\.\d{1,3})?[%#Q*^]{0,1}$/;

                                if (values && !valReg.test(values)) {
                                  result = false;
                                }

                                if (result) {
                                  callback();
                                } else {
                                  callback('輸入格式錯誤，僅能至多五位正整數、三位小數與一符號 %、#、Q、*、^');
                                }
                              }
                            }
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </td>
                    );
                  } else {
                    return null;
                  }
                })}
                <td style={tableStyle.rightTd}>
                  {
                    fields.map((field, idx) => {
                      if (idx != 0 && idx != 1) {
                        if (listArr[idx] == undefined || listArr[idx]['is_delete'] == undefined) {
                          listNum++;
                        }

                        return (
                          <div
                            key={`${isName}_r_${idx}`}
                            style={{ display: (listArr[idx] == undefined || listArr[idx]['is_delete'] == undefined) ? 'flex' : 'none', width: '100%' }}
                          >
                            <div style={{ flex: '400px', marginRight: '8px' }}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'country_id']}
                                fieldKey={[field.fieldKey, 'country_id']}
                                key={field.key}
                                label={(listNum == 1) ? ' ' : ''}
                              >
                                <Select
                                  showSearch
                                  optionFilterProp="children"
                                  optionLabelProp="label"
                                  allowClear={true}
                                  filterOption={(input, option) => {
                                    return option.showtext.toLowerCase().indexOf(input.toLowerCase()) >= 0 && option.key != '229';
                                  }}
                                >
                                  {
                                    (countryList)
                                      ? (
                                        countryList.map(d => (
                                          <Option
                                            key={d.id}
                                            label={d.country_name_zh}
                                            text={d.id}
                                            showtext={`${d.country_name_zh} ${d.country_name_en} (${d.country_code})`}
                                          >
                                            {`${d.country_name_zh} ${d.country_name_en} (${d.country_code})`}
                                          </Option>
                                        ))
                                      )
                                      : ([])
                                  }
                                </Select>
                              </Form.Item>
                            </div>
                            <div style={{ flex: 'auto', marginRight: '8px' }}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'value']}
                                fieldKey={[field.fieldKey, 'country_id']}
                                key={field.key}
                                label={(listNum == 1) ? ' ' : ''}
                                rules={[
                                  {
                                    validator(rule, values, callback) {
                                      let itemIsDelete = (form.getFieldValue()[isName][idx] && form.getFieldValue()[isName][idx]['is_delete'] == '1') ? (true) : false;
                                      let result = true;
                                      const valReg = /^\d{1,5}(\.\d{1,3})?[%#Q*^]{0,1}$/;

                                      if (!itemIsDelete && values && !valReg.test(values)) {
                                        result = false;
                                      }

                                      if (result) {
                                        callback();
                                      } else {
                                        callback('輸入格式錯誤，僅能至多五位正整數、三位小數與一符號 %、#、Q、*、^');
                                      }
                                    }
                                  }
                                ]}
                              >
                                <Input />
                              </Form.Item>
                            </div>
                            <div
                              style={{
                                flex: '100px',
                                marginTop: (listNum == 1) ? '30px' : '0'
                              }}
                            >
                              {
                                (listNum == 1)
                                  ? (
                                    <Button
                                      block
                                      onClick={() => {
                                        add();
                                      }}
                                    >
                                      新增
                                    </Button>
                                  )
                                  : (
                                    <Button
                                      type="link"
                                      block
                                      onClick={() => {
                                        if (listArr[idx] == undefined || listArr[idx]['id'] == undefined) {
                                          remove(field.name);
                                        } else {
                                          let updateArr = form.getFieldsValue()[isName].slice();
                                          updateArr[idx]['is_delete'] = '1';
                                          form.setFieldsValue({
                                            [isName]: updateArr
                                          });
                                        }
                                      }}
                                    >
                                      移除
                                    </Button>
                                  )
                              }
                            </div>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })
                  }
                </td>
                <td>
                  &nbsp;
                </td>
              </Fragment>
            );
          }}
        </Form.List>
      </tr>
    </Fragment>
  );
}

export default FormSplit;