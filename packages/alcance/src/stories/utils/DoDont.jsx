import React from 'react';
import styled from 'styled-components';
import { CheckIcon, CrossIcon } from '@storybook/icons';

const Container = styled.div`
  display: grid;
  grid-template-columns: ${({ stacked }) => (stacked ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))')};
  gap: 32px;
  margin: 32px 0;
  width: 100%;
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const VisualArea = styled.div`
  background: #fff;
  padding: 24px;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  border: 1px solid #e0e0e0;
  border-bottom: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;

const DescriptionArea = styled.div`
  padding: 20px;
  color: #fff !important;
  font-size: 14px;
  line-height: 1.5;
  background-color: ${({ type }) => (type === 'do' ? '#2A4B29' : '#4a2b2b')};
  border-top: 4px solid ${({ type }) => (type === 'do' ? '#6DB165' : '#C13838')};

  * {
    color: #fff !important;
  }
`;

const Title = styled.h4`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 700;
  display: flex !important;
  align-items: center;
  gap: 8px;
  color: #fff !important;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ type }) => (type === 'do' ? '#6DB165' : '#C13838')};
  color: ${({ type }) => (type === 'do' ? '#1a331a' : '#fff')};
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

export const Do = ({ children, title = 'Faça', visual }) => {
  return (
    <ItemWrapper>
      <VisualArea>{visual}</VisualArea>
      <DescriptionArea type="do">
        <Title>
          <IconWrapper type="do" aria-hidden="true">
            <CheckIcon />
          </IconWrapper>
          {title}
        </Title>
        {children}
      </DescriptionArea>
    </ItemWrapper>
  );
};

export const Dont = ({ children, title = "Não Faça", visual }) => {
  return (
    <ItemWrapper>
      <VisualArea>{visual}</VisualArea>
      <DescriptionArea type="dont">
        <Title>
          <IconWrapper type="dont" aria-hidden="true">
            <CrossIcon />
          </IconWrapper>
          {title}
        </Title>
        {children}
      </DescriptionArea>
    </ItemWrapper>
  );
};

export const DoDont = ({ children, stacked = false }) => {
  return <Container stacked={stacked}>{children}</Container>;
};

DoDont.Do = Do;
DoDont.Dont = Dont;

export default DoDont;
