import React, { useState, useEffect } from 'react';
import {
  Form,
  Select,
  Spin,
  Row,
  Col,
  Button,
  Radio,
} from 'antd';
import commFn from '@/fn/comm';

const { Option } = Select;

const FormContractGroup = props => {
  const {
    isLabel, // 標題
    isEditContract, // 是否為編輯狀態，類似isEdit不過退出群組需重置
    contractGroup, // 合約群組，有兩種狀態 1.array(建立群組) 2.string(加入群組)
    setContractGroup,
    contractGroupArr,// 群組下拉清單
    setContractGroupArr,
    showConfirm,// 呼叫的確認視窗，因為要打api所以放在父層級
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  // 群組狀態，預設 無，'0'=>建立群組 '1'=>加入群組
  const [groupType, setGroupType] = useState(undefined);

  let timer;

  const searchOption = (keyword) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/contract_song/contract_group_list', (res) => {
        setContractGroupArr(res);
        setIsFetching(false);
      }, groupType === '1' ? [{ key: 'type', value: 'group' }] : undefined);
    }, 200);
  };

  // 當選擇加入群組或是已在群組中，render群組成員
  const getGroupContent = () => {
    const group = contractGroupArr.find(e => e.contract_group_name === contractGroup);
    if (group && typeof group === 'object') {
      return group.contract_group.map(
        (data, index) => {
          if (index === 0) {
            return (<Col key={data.id}><span>群組成員：</span>{data.contract_code}</Col>);
          }
          return (<Col key={data.id} style={{ marginLeft: '70px' }}>{data.contract_code}</Col>);
        },
      );
    }
    return undefined;
  };

  useEffect(() => {
    if (typeof contractGroup === 'string'){
      setGroupType('1');
    }
    getGroupContent();
  }, [contractGroup]);

  return (
    <Row>
      <Col xs={24} lg={18}>
        <Form.Item
          label={isLabel}
        >
          {
            isEditContract ? undefined :
              (<Radio.Group
                options={[
                  { label: '建立群組', value: '0' },
                  { label: '加入群組', value: '1' },
                ]}
                onChange={e => {
                  setGroupType(e.target.value);
                  setContractGroup([]);
                  if (e.target.value === '1') {
                    setContractGroup('');
                  }
                  setContractGroupArr([]);
                }}
                style={{ marginBottom: '16px' }}
                defaultValue={groupType}
              />)
          }
          {
            ['0', '1'].includes(groupType) ? <Select
              showSearch
              mode={groupType === '1' ? undefined : 'multiple'}
              optionFilterProp="children"
              optionLabelProp="label"
              filterOption={false}
              allowClear
              disabled={isEditContract}
              notFoundContent={isFetching ? <Spin size="small"/> : null}
              onSearch={(value) => {
                searchOption(value);
              }}
              onChange={(value) => {
                setContractGroup(value);
                if (!value) {
                  setContractGroupArr([]);
                  setContractGroup('');
                }
              }}
              value={contractGroup}
            >
              {
                contractGroupArr.map((d) => {
                  if (groupType === '1' && d) {
                    return (<Option
                      key={d.contract_group_name}
                      label={d.contract_group_name}
                      text={d.contract_group_name}
                    >
                      {d.contract_group_name}
                    </Option>);
                  }
                  if (groupType === '0' && d) {
                    return (<Option
                      key={d.contract_code}
                      label={d.contract_code}
                      text={d.contract_code}
                    >
                      {d.contract_code}
                    </Option>);
                  }
                  return undefined;
                })
              }
            </Select> : undefined
          }
          {
            groupType ? getGroupContent() : undefined
          }
        </Form.Item>
      </Col>
      <Col xs={24} lg={5} style={{ marginLeft: '5px', marginTop: '30px' }}>
        {isEditContract ? <Button onClick={() => showConfirm('delContractGroup')}>退出</Button> : undefined}
      </Col>
    </Row>
  );
};

export default FormContractGroup;
