import React, { useState, Fragment } from 'react';
import {
  Form,
  AutoComplete,
  Spin,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = AutoComplete;

const FormUserCompany = props => {
  const {
    form,
    isName,
    isLabel,
    isList,
    setIsList,
    isHiddenLabel,
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;
  const [companyName, setCompanyName] = useState('');
  const [companyCode, setCompanyCode] = useState('');

  const searchOption = (keyword, idx) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/company/Auto', (res) => {
        setIsList(res);
        setIsFetching(false);
      });
    }, 200);
  }

  return (
    <Fragment>
      <Form.Item
        name={isName}
        label={isLabel}
        rules={[
          { required: true, message: '此欄位為必填' },
        ]}
      >
        <AutoComplete
          style={{ width: '100%' }}
          filterOption={false}
          allowClear={true}
          notFoundContent={isFetching ? <Spin size="small" /> : null}
          onSearch={(value) => {
            searchOption(value);
          }}
          onChange={(value, option) => {
            if (!value) {
              setCompanyName('');
              setCompanyCode('');
            }

            if (option && option.key) {
              setCompanyName(option.obj.name);
              setCompanyCode(option.obj.company_code);
            }
          }}
        >
          {
            (isList)
              ? (
                isList.map(d => (
                  <Option
                    key={d.id}
                    value={d.name}
                    obj={d}
                  >
                    {`${d.name} (${d.company_code})`}
                  </Option>
                ))
              )
              : ([])
          }
        </AutoComplete>
      </Form.Item>
      <label
        className={styles.searchLabel}
        style={{ display: (isHiddenLabel) ? 'none' : 'flex' }}
      >
        {(companyCode) ? `已選擇：${companyName} (${companyCode})` : ''}
      </label>
    </Fragment>
  );
}

export default FormUserCompany;