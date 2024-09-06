import React from 'react';
import {
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Box,
    Button,
    TextField,
} from '@mui/material';

const ProcessingTaskComponent = ({
    dataDropItem,
    setdataDropItem,
    sign,
    setSign,
    threshold,
    setThreshold,
    onSubmit
}) => {
    const handleDrop = (e) => {
        e.preventDefault();
        const itemId = e.dataTransfer.getData('text/plain');
        setdataDropItem(itemId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <div className='title-font'>Data :</div>
            <Box sx={{ padding: 1 }}>
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    style={{
                        border: '2px dashed #ccc',
                        padding: '20px',
                        textAlign: 'center',
                        marginTop: '20px',
                    }}
                >
                    {dataDropItem ? (
                        <TextField value={dataDropItem} variant="outlined" fullWidth />
                    ) : (
                        'Drop data here'
                    )}
                </div>
            </Box>

            <div className='title-font'>Sign :</div>
            <Box sx={{ padding: 1 }}>
                <FormControl fullWidth>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={sign === '<'}
                                    onChange={() => setSign('<')}
                                />
                            }
                            label="<"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={sign === '>'}
                                    onChange={() => setSign('>')}
                                />
                            }
                            label=">"
                        />
                    </FormGroup>
                </FormControl>
            </Box>

            <Box sx={{ padding: 1 }}>
                <TextField
                    label="Threshold"
                    variant="outlined"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    fullWidth
                />
            </Box>

            <Box sx={{ padding: 1 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onSubmit}
                    fullWidth
                >
                    Submit
                </Button>
            </Box>
        </>
    );
};

export default ProcessingTaskComponent;
