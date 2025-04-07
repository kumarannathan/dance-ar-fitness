import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';

interface Dance {
  id: string;
  title: string;
  thumbnailUrl: string;
  createdAt: Date;
  duration: string;
}

interface DanceGridProps {
  dances: Dance[];
  onDelete?: (id: string) => void;
}

const DanceGrid: React.FC<DanceGridProps> = ({ dances, onDelete }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedDance, setSelectedDance] = React.useState<string | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, danceId: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedDance(danceId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDance(null);
  };

  const handleDelete = () => {
    if (selectedDance && onDelete) {
      onDelete(selectedDance);
      handleMenuClose();
    }
  };

  const handleDanceClick = (danceId: string) => {
    navigate(`/dance/${danceId}`);
  };

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {dances.map((dance) => (
          <Card
            key={dance.id}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'transform 0.2s ease-in-out',
              },
            }}
            onClick={() => handleDanceClick(dance.id)}
          >
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="200"
                image={dance.thumbnailUrl}
                alt={dance.title}
                sx={{ objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption">{dance.duration}</Typography>
              </Box>
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
                onClick={(e) => handleMenuClick(e, dance.id)}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="div" noWrap>
                {dance.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(dance.createdAt).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: 'background.default',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <MenuItem
          onClick={handleDelete}
          sx={{
            color: 'error.main',
            '&:hover': {
              bgcolor: 'error.dark',
              color: 'white',
            },
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default DanceGrid; 