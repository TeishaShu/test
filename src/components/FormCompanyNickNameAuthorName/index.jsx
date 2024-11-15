import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Spin,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = Select;

const FormCompanyNickNameAuthorName = props => {
  const {
    form,
    isLabel,
    isRequired,  // (optional) required is true
    changeToCompanyName,  // (optional) change to companyName: true
    // uiSelect	
    isUiSelectVal,
    isSetUiSelectVal,
    customAuthorOptLabel,  // (optional) change Author Option Label
    // for company	
    isCpName,
    isCpSelectText,
    isCpList,
    setIsCpList,
    isCompanyIdName,  // (optinal) need company.id parameter and 'changeToCompanyName' isn't true	
    cpCodeLabel,
    setCpCodeLabel,
    // for author	
    isAtName,
    isAtSelectText,
    isAtList,
    setIsAtList,
    atCodeLabel,
    setAtCodeLabel,
  } = props;
  const [isCpFetching, setIsCpFetching] = useState(false);
  let cpTimer;
  const [isAtFetching, setIsAtFetching] = useState(false);
  let atTimer;

  const searchCpOption = (keyword) => {
    setIsCpFetching(true);
    clearTimeout(cpTimer);
    cpTimer = setTimeout(() => {
      let cpApi = '/company';

      if (changeToCompanyName) {
        cpApi = '/company/auto'
      }

      commFn.searchOption(keyword, cpApi, (res) => {
        setIsCpList(res);
        setIsCpFetching(false);
      });
    }, 200);
  }

  const searchAtOption = (keyword) => {
    return new Promise((resolve, reject) => {
      setIsAtFetching(true);
      clearTimeout(atTimer);
      atTimer = setTimeout(() => {
        commFn.searchOption(keyword, '/author/author_name', (res) => {
          setIsAtList(res);
          setIsAtFetching(false);
          resolve(res);
        });
      }, 200);
    });
  }

  const changeUiSelectVal = val => {
    isSetUiSelectVal(val);
  }

  return (
    <div style={{ display: 'flex' }}>
      <Form.Item
        label={isLabel}
        style={{ width: '30%', marginRight: '8px' }}
        className={(isRequired) ? (styles.addRequiredStar) : ''}
      >
        <Select
          onChange={changeUiSelectVal}
          value={isUiSelectVal}
        >
          <Option value="1">公司</Option>
          <Option value="2">{customAuthorOptLabel ? customAuthorOptLabel : '藝人'}</Option>
        </Select>
      </Form.Item>
      <div
        style={{
          width: '70%',
          display: (isUiSelectVal == '1') ? 'flex' : 'none'
        }}
      >
        <Form.Item
          name={isCpName}
          label=" "
          style={{ width: '100%' }}
          className={(isRequired) ? (styles.hideRequiredStar) : ''}
          rules={[
            { required: (isRequired && isUiSelectVal == '1') ? true : false, message: '此欄位為必填' }
          ]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            optionLabelProp="label"
            filterOption={false}
            allowClear={true}
            notFoundContent={isCpFetching ? <Spin size="small" /> : null}
            onSearch={(value) => {
              searchCpOption(value);
            }}
            onChange={(value, option) => {
              let obj = {};

              // when click clearIcon, clear 'isCpList' data	
              if (!value) {
                setIsCpList([]);
              }

              if (option) {
                obj[isCpSelectText] = option.label;
                if (!changeToCompanyName && isCompanyIdName) {
                  obj[isCompanyIdName] = option.companyid;
                }
                form.setFieldsValue(obj);
                setCpCodeLabel(option.text);
              } else {
                obj[isCpSelectText] = '';
                if (!changeToCompanyName && isCompanyIdName) {
                  obj[isCompanyIdName] = '';
                }
                form.setFieldsValue(obj);
                setCpCodeLabel('');
              }
            }}
            onFocus={() => {
              setIsCpList([]);
              searchCpOption(form.getFieldValue()[isCpSelectText]);
            }}
            onSelect={(value, option) => {
              searchCpOption(option.label);
            }}
          >
            {isCpList.map(d => {
              if (changeToCompanyName) {
                return (
                  <Option
                    key={d.id}
                    label={d.name}
                    text={d.company_code}
                  >
                    {`${d.name} (${d.company_code})`}
                  </Option>
                );
              }

              return (
                <Option
                  key={d.id}
                  label={d.nickname}
                  text={d.company_code}
                  companyid={d.company_id}
                >
                  {`${d.nickname} (${d.company_code})`}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        {
          (!changeToCompanyName && isCompanyIdName)
            ? (
              <Form.Item
                name={isCompanyIdName}
                noStyle
              >
                <Input type="hidden" />
              </Form.Item>
            )
            : (null)
        }
        <label className={styles.searchLabel}>{(cpCodeLabel) ? `(${cpCodeLabel})` : ''}</label>
      </div>
      <div
        style={{
          width: '70%',
          display: (isUiSelectVal == '2') ? 'flex' : 'none'
        }}
      >
        <Form.Item
          label=" "
          name={isAtName}
          style={{ width: '100%' }}
          className={(isRequired) ? (styles.hideRequiredStar) : ''}
          rules={[
            { required: (isRequired && isUiSelectVal == '2') ? true : false, message: '此欄位為必填' }
          ]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            optionLabelProp="label"
            filterOption={false}
            allowClear
            notFoundContent={isAtFetching ? <Spin size="small" /> : null}
            onSearch={(value) => {
              searchAtOption(value);
            }}
            onChange={(value, option) => {
              const obj = {};

              // when click clearIcon, clear 'isAtList' data	
              if (!value) {
                setIsAtList([]);
              }

              if (option) {
                obj[isAtSelectText] = option.key;
                form.setFieldsValue(obj);
                setAtCodeLabel(option.text);
              } else {
                obj[isAtSelectText] = '';
                form.setFieldsValue(obj);
                setAtCodeLabel('');
              }
            }}
            onFocus={() => {
              setIsAtList([]);
              searchAtOption(form.getFieldValue()[isAtSelectText]);
            }}
            onSelect={(value, option) => {
              searchAtOption(option.label);
            }}
          >
            {isAtList.map(d => (
              <Option
                key={d.id}
                label={d.name}
                text={d.author_code}
              >
                {`${d.name} (${d.author_code})`}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <label className={styles.searchLabel}>{(atCodeLabel) ? `(${atCodeLabel})` : ''}</label>
      </div>
    </div>
  );
}

export default FormCompanyNickNameAuthorName; 