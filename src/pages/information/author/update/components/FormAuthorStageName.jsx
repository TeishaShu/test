import React, { useState, Fragment } from 'react';
import {
  Form,
  Row,
  Col,
  Select,
  Button,
  Spin,
} from 'antd';
import { Link } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = Select;

// 注意：此 component 會把團體型態濾掉，為藝人頁面需求
const FormAuthorStageName = props => {
  const {
    form,
    membersList,
    setMembersList,
    membersLabel,
    setMembersLabel,
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  const searchOption = (keyword, idx) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/Author/author_stage', (res) => {
        let tmpMembersList = membersList.slice();

        tmpMembersList[idx] = res;
        setMembersList(tmpMembersList);
        setIsFetching(false);
      }, [{ key: 'group', value: '0' }]);
    }, 200);
  }

  return (
    <Form.List
      name="members"
    >
      {(fields, { add, remove }) => {
        let arr = form.getFieldValue().members;
        let num = 0;

        return (
          <Fragment>
            {fields.map((field, idx) => {
              if (arr[idx] == undefined || arr[idx]['is_delete'] == undefined) {
                num++;
              }

              return (
                <Row
                  gutter={[8, 8]}
                  key={`members_${field.fieldKey}`}
                  style={(arr[idx] == undefined || arr[idx]['is_delete'] == undefined) ? {} : { display: 'none' }}
                >
                  <Col flex="auto">
                    <Form.Item
                      {...field}
                      name={[field.name, 'member_author_stage_name_id']}
                      fieldKey={[field.fieldKey, 'member_author_stage_name_id']}
                      label={(num === 1) ? '組合成員' : ''}
                      key={`members_stage_name_id_${field.fieldKey}`}
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
                          let orgMembersLabel = membersLabel.slice();
                          let arrAddEdit = form.getFieldsValue().members.slice();

                          arrAddEdit[idx].member_author_id = (option) ? (option.authorid) : '';
                          arrAddEdit[idx].stage_name = (option) ? (option.label) : '';
                          if (arr[idx] && arr[idx].id) {
                            arrAddEdit[idx]['is_edit'] = '1';
                          }
                          form.setFieldsValue({ members: arrAddEdit });

                          orgMembersLabel[idx] = (option) ? (option.text) : '';
                          setMembersLabel(orgMembersLabel);
                        }}
                        onFocus={() => {
                          let tmpMemberList = membersList.slice();

                          tmpMemberList[idx] = [];
                          setMembersList(tmpMemberList);

                          if (form.getFieldValue()['members'][idx] && form.getFieldValue()['members'][idx]['stage_name']) {
                            searchOption(form.getFieldValue()['members'][idx]['stage_name'], idx);
                          }
                        }}
                        onSelect={(value, option) => {
                          searchOption(option.label, idx);
                        }}
                      >
                        {
                          (membersList && membersList[idx])
                            ? (
                              membersList[idx].map(d => (
                                <Option
                                  key={d.id}
                                  label={d.stage_name}
                                  text={d.author_code}
                                  showtext={`${d.stage_name} (${d.author_code})`}
                                  authorid={d.author_id}
                                >
                                  {`${d.stage_name} (${d.author_code})`}
                                </Option>
                              ))
                            )
                            : ([])
                        }
                      </Select>
                    </Form.Item>
                    <label className={styles.searchMutliLabel}>{(membersLabel[idx]) ? `(${membersLabel[idx]})` : ''}</label>
                  </Col>
                  <Col flex="100px"
                    style={(num === 1) ? { marginTop: '30px' } : {}}
                  >
                    {
                      (num === 1) ?
                        (<Button block onClick={() => { add(); }}>新增成員</Button>) :
                        (
                          <Button
                            type="link"
                            block
                            onClick={() => {
                              if (arr[idx] === undefined || arr[idx]['id'] === undefined) {
                                remove(field.name);
                              } else {
                                let updateArr = form.getFieldValue().members.slice();
                                updateArr[idx]['is_delete'] = '1';
                                form.setFieldsValue({ members: updateArr });
                              }
                            }}
                          >
                            移除
                          </Button>
                        )
                    }
                  </Col>
                </Row>
              );
            })}
          </Fragment>
        );
      }}
    </Form.List>
  );
}

export default FormAuthorStageName;

