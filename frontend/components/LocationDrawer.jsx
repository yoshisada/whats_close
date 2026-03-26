'use client'

import { useState } from "react";
import Drawer from '@mui/material/Drawer';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocationCard from "./LocationCard";
import './LocationDrawer.css';

const drawerWidth = 460;
const drawerBleeding = 20;

export default function LocationDrawer() {
  const [open, setOpen] = useState(false);

  const cards = (
    <div className="card-list">
      {[...Array(10)].map((_, index) => (
        <LocationCard
          key={index}
          title="Central Park"
          rating={4.8}
          priceLevel={2}
          weather="sunny"
          transportOptions={[
            { type: 'car', time: '15 min' },
            { type: 'bike', time: '25 min' },
            { type: 'train', time: '20 min' },
          ]}
          onDelete={() => console.log('delete')}
          onSetRoute={() => console.log('set route')}
        />
      ))}
    </div>
  );

  return (
    <div>
      {/* Menu button — hidden on mobile */}
      <div className="menu-btn">
        <IconButton onClick={() => setOpen(true)}>
          <MenuIcon />
        </IconButton>
      </div>

      {/* Desktop — right drawer */}
      <Drawer
        className="desktop-drawer"
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        hideBackdrop
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
      >
        <div className="drawer-header">
          <IconButton onClick={() => setOpen(false)}>
            <ChevronRightIcon />
          </IconButton>
          <button className="btn-clear-all" onClick={() => console.log('clear all')}>
            Clear All
          </button>
        </div>
        {cards}
      </Drawer>

      {/* Mobile — bottom swipeable drawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        keepMounted
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            height: '75vh',
            overflow: 'visible',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
          },
        }}
        // ModalProps={{
        //   keepMounted: true,
        //   disableScrollLock: true,
        // }}
      >
        <div className="puller-tab">
          <div className="puller" />
        </div>
        <div className="mobile-drawer-inner">
          <div className="drawer-header">
            <button className="btn-clear-all" onClick={() => console.log('clear all')}>
              Clear All
            </button>
          </div>
          <div className="mobile-card-list">
            {cards}
          </div>
        </div>
      </SwipeableDrawer>
    </div>
  );
}