import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, X, Trash2 } from "lucide-react";

const Alert = ({ message, type, onClose }) => {
  return (
    <div 
      className={`flex items-center justify-between w-full max-w-2xl p-4 mb-4 rounded-lg ${
        type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
      }`}
    >
      <p className="flex-1">{message}</p>
      <button 
        onClick={onClose}
        className="ml-4 p-1 hover:bg-red-200 rounded-full transition-colors"
        aria-label="Close alert"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const WeekNavigator = ({ currentDate, onPreviousWeek, onNextWeek }) => {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getWeekRange = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return {
      start: formatDate(startOfWeek),
      end: formatDate(endOfWeek)
    };
  };

  const weekRange = getWeekRange(currentDate);

  return (
    <div className="flex items-center justify-center space-x-4 bg-white rounded-lg shadow-md p-4 mb-6 w-full max-w-2xl">
      <button
        onClick={onPreviousWeek}
        className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Previous week"
      >
        <ChevronLeft className="h-6 w-6 text-gray-600" />
      </button>

      <div className="flex items-center space-x-3">
        <Calendar className="h-5 w-5 text-blue-500" />
        <div className="text-lg font-medium text-gray-700">
          <span>{weekRange.start}</span>
          <span className="mx-2">-</span>
          <span>{weekRange.end}</span>
        </div>
      </div>

      <button
        onClick={onNextWeek}
        className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Next week"
      >
        <ChevronRight className="h-6 w-6 text-gray-600" />
      </button>
    </div>
  );
};

const MenuItem = ({ item, onSelect, isSelected, disabled, onDelete, isRegistered }) => {
  const isFull = item.spotsTaken >= item.spotsAvaliable;
  const status = isFull ? "Full" : "Open";
  
  return (

    <div
      onClick={!isFull && !disabled && !isRegistered ? () => onSelect(item.mealID) : undefined}
      className={`flex flex-col items-center justify-center p-4 rounded-md shadow-md w-64 mt-4 
        ${isFull || disabled ? "bg-gray-300" : isSelected ? "bg-blue-100" : "bg-white hover:bg-gray-100"}`}
    >
      <h2 className="text-lg font-semibold mb-1">
        {item.day} ({item.isDinner ? "Dinner" : "Lunch"})
      </h2>
      <p className="text-gray-500 mb-2">{item.date}</p>
      <p className="text-gray-700 mb-2">{item.description}</p>
      <p className={`text-sm font-bold ${isFull ? "text-red-500" : "text-green-500"}`}>
        {status}
      </p>
      <p className="text-gray-500">
        Spots taken: {item.spotsTaken}/{item.spotsAvaliable}
      </p>
      {isRegistered ? (
        <button
          onClick={() => onDelete(item.mealID)}
          className="mt-2 flex items-center gap-2 px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
          aria-label="Cancel RSVP"
        >
          <Trash2 className="h-4 w-4" />
          <span>Cancel RSVP</span>
        </button>
      ) : (
        undefined
      )}
    </div>
  );
};

const Menu = () => {
  const [meals, setMeals] = useState([]);
  const [registeredMeals, setRegisteredMeals] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/getMenu", {
          headers: { "content-type": "application/json" },
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ currentDate }),
        });

        if (!res.ok) throw new Error("Server gave bad response for getting menu");

        const data = await res.json();
        const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        const transformedMeals = data.meals.map((meal) => ( {
          mealID: meal.mealID,
          date: meal.date,
          isDinner: meal.isDinner,
          day: dayMap[meal.dayOfWeek],
          dayOfWeek: meal.dayOfWeek,
          description: meal.description,
          spotsTaken: meal.spotsTaken,
          spotsAvaliable: meal.spotsAvailable,
          names: [],
        }));
        // sort meals based on day of week
        transformedMeals.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
        console.log(transformedMeals)
        setMeals(transformedMeals);
      } catch (err) {
        console.error("Error fetching menu:", err);
        setAlert({ type: "error", message: "Failed to load menu" });
      }
    };
    const fetchRSVPS = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/getRSVPs?date=" +currentDate.toISOString(), {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Server gave bad response for getting RSVPs");
        const data = await res.json();
        //set the meals to include the names of the rsvp associated with each meal ID
        const updatedMeals = meals.map(meal => {
          if (meal.mealID === data.rsvps.mealID) {
            return {
              ...meal,
              names: [...meal.names, ...data.rsvps.users]
            };
          }
          return meal;
        });
        
        // setMeals(updatedMeals);
        setRegisteredMeals(data.selectedMeals);
        console.log("Registered meals: " +registeredMeals);
        
      } catch (err) {
        console.log("failed to fetch rsvps's: " + err)
      }
    };
    try {
      fetchMenu();
    } catch (err) {
      console.log("opsie, " + err)
    } finally {
      fetchRSVPS();
    }
    
  }, [currentDate]);

  const handleMealSelect = (mealID) => {
    setSelectedMeals((prev) => {
      if (prev.includes(mealID)) {
        return prev.filter(id => id !== mealID);
      }
      if (prev.length >= 2) {
        setAlert({ type: "error", message: "You can only select up to 2 meals" });
        return prev;
      }
      return [...prev, mealID];
    });
  };

  const handleConfirmRSVP = async () => {
    if (selectedMeals.length === 0) {
      setAlert({ type: "error", message: "Please select at least one meal" });
      return;
    }
    
    try {
      for (const mealID of selectedMeals) {
        console.log("selected meals " , mealID);
        const response = await fetch("http://localhost:3001/api/newRSVP", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ mealID: mealID }),
        });

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message);
        }

        setMeals(prevMeals =>
          prevMeals.map(meal =>
            meal.mealID === mealID
              ? { ...meal, spotsTaken: meal.spotsTaken + 1 }
              : meal
          )
        );
      }

      setAlert({ type: "success", message: "Successfully RSVP'd to selected meals!" });
      setSelectedMeals([]);
      setCurrentDate(currentDate);
    } catch (error) {
      setAlert({ type: "error", message: error.message || "Failed to RSVP" });
    }
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
    setSelectedMeals([]);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
    setSelectedMeals([]);
  };

  const lunchMeals = meals.filter((meal) => !meal.isDinner);
  const dinnerMeals = meals.filter((meal) => meal.isDinner);

  const handleDeleteRSVP = async (mealID) => {
    try {
      const response = await fetch("http://localhost:3001/api/deleteRSVP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mealID }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }

      // Remove the meal from registeredMeals
      setRegisteredMeals(prevRegistered => 
        prevRegistered.filter(id => id !== mealID)
      );
      // Refetch the menu to get updated counts by resetting date
      setCurrentDate(currentDate);

      setAlert({ 
        type: "success", 
        message: "Successfully cancelled RSVP" 
      });
    } catch (error) {
      setAlert({ 
        type: "error", 
        message: error.message || "Failed to cancel RSVP" 
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Meal Menu</h1>
      
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <WeekNavigator 
        currentDate={currentDate}
        onPreviousWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
      />

      {selectedMeals.length > 0 && (
        <button
          onClick={handleConfirmRSVP}
          className="mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Confirm RSVP ({selectedMeals.length}/2 selected)
        </button>
      )}

      <div className="w-full mb-8">
        <h2 className="text-2xl font-semibold text-center">Lunch</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {lunchMeals.map((meal) => (
            <MenuItem
              key={meal.mealID}
              item={meal}
              onSelect={handleMealSelect}
              onDelete={handleDeleteRSVP}
              isSelected={selectedMeals.includes(meal.mealID)}
              isRegistered={registeredMeals.includes(meal.mealID)}
              disabled={selectedMeals.length >= 2 && !selectedMeals.includes(meal.mealID)}
            />
          ))}
        </div>
      </div>

      <div className="w-full">
        <h2 className="text-2xl font-semibold text-center">Dinner</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {dinnerMeals.map((meal) => (
            <MenuItem
              key={meal.mealID}
              item={meal}
              onSelect={handleMealSelect}
              onDelete={handleDeleteRSVP}
              isSelected={selectedMeals.includes(meal.mealID)}
              isRegistered={registeredMeals.includes(meal.mealID)}
              disabled={selectedMeals.length >= 2 && !selectedMeals.includes(meal.mealID)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;