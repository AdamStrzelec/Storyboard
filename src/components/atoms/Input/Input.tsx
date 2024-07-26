import React from 'react';
import styled from 'styled-components';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<
	HTMLInputElement,
	React.PropsWithChildren<InputProps>
>((props, ref) => <StyledInput type="text" ref={ref} {...props} />);

Input.displayName = 'Input';

const StyledInput = styled.input`
	border: none;
	border-bottom: 1px solid black;
	outline: none;
	width: 100%;
	font-family: 'Inter';
	font-size: 13px;
	font-weight: 400;
	line-height: 18px;
	padding: 0;
`;
