import { Box, BoxProps } from "@chakra-ui/react";

interface DisabledBoxProps extends BoxProps {
    isDisabled?: boolean;
    onClick?: () => void;
}

export const DisabledBox: React.FC<DisabledBoxProps> = ({ isDisabled, onClick, ...props }) => {
    const handleClick = () => {
        if (!isDisabled && onClick) {
            onClick();
        }
    };

    return (
        <Box
            {...props}
            onClick={handleClick}
            _disabled={{
                opacity: 0.4,
                cursor: 'not-allowed',
                filter: 'grayscale(100%)',
            }}
            style={{
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.4 : 1,
                filter: isDisabled ? 'grayscale(100%)' : 'none',
                ...props.style,
            }}
        />
    );
};