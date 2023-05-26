import { useCallback, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { formatDate } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import "../css/SideCalendar.css"
import { useRef } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";

const SideCalendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const calendarRef = useRef(null);
  const initialEventsLoaded = useRef(false);


  const loadTrips = useCallback (async () => {
    try {
      const response = await fetch(`http://localhost:5000/trips`, {
        method: 'GET',
        headers: { token: localStorage.token} 
      }); 
      const trips = await response.json();
  

      // Update the calendar with the loaded trips
      trips.forEach((trip) => {
        const calendarApi = calendarRef.current.getApi();
        const event = {
          id: trip.id,
          title: trip.name,
          start: trip.date,
          allDay: true, 
        };
        calendarApi.addEvent(event);
      });
    } catch (error) {
      console.error('Error loading trips:', error);
    }
  }, []);

  useEffect(() => {
    if (!initialEventsLoaded.current) {
      loadTrips();
      initialEventsLoaded.current = true;
    }
  }, [loadTrips]);

  const handleDateClick = async (selected) => {
    const title = prompt("Įveskite įvykio pavadinimą");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();
  
    if (title) {
      const newEvent = {
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      };
      calendarApi.addEvent(newEvent);
  
      // Save the event automatically
      try {
        const response = await fetch('http://localhost:5000/trips', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: localStorage.token,
          },
          body: JSON.stringify({
            date: newEvent.start,
            events: [{ title: newEvent.title }],
          }),
        });
        await response.json();
        toast.success('Trip saved!');
      } catch (error) {
        console.error('Error saving trip:', error);
      }
    }
  };
  const handleEventClick = async (selected) => {
    if (
      window.confirm(
        `Ar tikrai norite ištrinti šį įvykį '${selected.event.title}'`
      )
    ) {
      try {
        // Send a DELETE request to the server
        await fetch(`http://localhost:5000/trips`, {
          method: 'DELETE',
          headers: { token: localStorage.token, tripId: selected.event.id } 
        });

        // Remove the event from the calendar
        selected.event.remove();
        toast.success('Trip deleted!');
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
    }
  };



  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" className="calendarcont">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          p="15px"
          borderRadius="4px"
          className="tripscont glass"
        >
          <Typography className="glass" variant="h5">Kelionės</Typography>
          <List >
            {currentEvents.map((event, index) => (
              <ListItem
                key={`${event.id}-${index}`} // Use a unique key combining the event ID and the index
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px" className="glass">
          <FullCalendar
            ref={calendarRef}
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
          // initialEvents={[
          //   {
          //     id: "12315",
          //     title: "All-day event",
          //     date: "2022-09-14",
          //   },
          //   {
          //     id: "5123",
          //     title: "Timed event",
          //     date: "2022-09-28",
          //   },
          // ]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SideCalendar;
