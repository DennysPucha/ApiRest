import React from 'react';

export const Input = React.forwardRef(({ type, id, ...rest }, ref) => (
    <input
        ref={ref}
        type={type}
        id={id}
        {...rest}
        className="w-full text-black border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
    />
));

Input.displayName = 'Input';