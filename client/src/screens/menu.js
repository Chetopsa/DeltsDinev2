import React, { Component, useState, useEffect } from "react";

// gonna have to fetch the data
const dfake_data = [{ mealID: 1, date: "01-22-2024", isDinner:false, day: "Monday", description: "Grilled Cheese", spotstaken: 0, spotsAvaliable:10 }, 
    { mealID: 2, date: "01-23-2024", isDinner: false, day: "Tuesday", description: "BLT", spotstaken: 0, spotsAvaliable:10 }, 
    { mealID: 3, date: "01-24-2024", isDinner: false, day: "Wedensday", description: "Chicken Salad", spotstaken: 0, spotsAvaliable:10 }, 
    { mealID: 4, date: "01-25-2024", isDinner: false, day: "Thursday", description: "Tomato Soup", spotstaken: 0, spotsAvaliable:10 }, 
    { mealID: 5, date: "01-22-2024", isDinner: true, day: "Monday", description: "Steak", spotstaken: 0, spotsAvaliable:10 }, 
    { mealID: 6, date: "01-23-2024", isDinner: true, day: "Tuesday", description: "Salmon", spotstaken: 0, spotsAvaliable:10 }, 
    { mealID: 7, date: "01-24-2024", isDinner: true, day: "Wedensday", description: "Chicken Alfredo", spotstaken: 0, spotsAvaliable:10 }, 
    { mealID: 8, date: "01-25-2024", isDinner: true, day: "Thursday", description: "Spaghetti", spotstaken: 0, spotsAvaliable:10 },
    { mealID: 9, date: "01-26-2024", isDinner: true, day: "Friday", description: "Poop Poop", spotstaken: 5, spotsAvaliable:10 }, 
    { mealID: 10, date: "01-26-2024", isDinner: false, day: "Friday", description: "Peep Peep", spotstaken: 10, spotsAvaliable:10 }];

  const MenuItem = ({ item, onSignUp }) => {
    const isFull = item.spotstaken >= item.spotsAvaliable;
    const status = isFull ? "Full" : "Open";
    
      return (
        <div
          onClick={() => !isFull && onSignUp(item.mealID)}
          className={`flex flex-col items-center justify-center p-4 rounded-md shadow-md w-64 mt-4 cursor-pointer transform transition-transform duration-200 hover:scale-105 ${
            isFull ? "bg-gray-300" : "bg-white hover:bg-gray-100"
          }`}
        >
          <h2 className="text-lg font-semibold mb-1">
            {item.day} ({item.isDinner ? "Dinner" : "Lunch"})
          </h2>
          <p className="text-gray-500 mb-2">{item.date}</p>
          <p className="text-gray-700 mb-2">{item.description}</p>
          <p
            className={`text-sm font-bold ${isFull ? "text-red-500" : "text-green-500"}`}
          >
            {status}
          </p>
          <p className="text-gray-500">Spots taken: {item.spotsTaken}/{item.spotsAvaliable}</p>
        </div>
      );
  };
    
  const Menu = () => {
    const [meals, setMeals] = useState(dfake_data);
    const [currentDate, setCurrentDate] = useState(new Date());
    const getWeekRange = (date) => {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
  
      return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
    };


    // fetch the menu data
    // let currentDate = new Date().toISOString();
    console.log(currentDate);
    let mealData = [];
    useEffect(() => {
      const fetchMenu = async () => {
        fetch("http://localhost:3001/api/getMenu", {
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
          credentials: "include",
          body: JSON.stringify({currentDate}),
        })
        .then((res) => {
          if (res.ok) { 
            console.log("yay");
          
            return res.json();
          }  
          else {throw new Error("Server gave bad response for getting menu");}
          
        })
        .then((data) => {
          console.log(data);
           // Transform the data
          const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          const transformedMeals = data.meals.map((meal) => ({
            mealID: meal.mealID,
            date: new Date(meal.date).toLocaleDateString(),
            isDinner: meal.isDinner,
            day: dayMap[meal.dayOfWeek],
            description: meal.description,
            spotsTaken: meal.spotsTaken,
            spotsAvaliable: meal.spotsAvailable,
          }));
          setMeals(transformedMeals);
          console.log("MEAL DATA: " + mealData);        
        })
        .catch((err) => {
          console.log("error findin meal " + err);
        });
      };
      fetchMenu();
    }, [currentDate]);


    
   

  
  const handleSignUp = (mealID) => {
    // fetch to sign up for meal here
    // YOUR CODE HERE
    setMeals((prevMeals) =>
      prevMeals.map((meal) =>
        meal.mealID === mealID && meal.spotsTaken < meal.spotsAvaliable
          ? { ...meal, spotsTaken: meal.spotsTaken + 1 }
          : meal
      )
    );
  };
  
    const lunchMeals = meals.filter((meal) => !meal.isDinner);
    const dinnerMeals = meals.filter((meal) => meal.isDinner);

    // switch the week
    const goToPreviousWeek = () => {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    };
  
    const goToNextWeek = () => {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    };
  
    return (
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Meal Menu</h1>
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-6 w-full max-w-md">
            <button
              onClick={goToPreviousWeek}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
            >
              Previous Week
            </button>
            <span className="text-lg font-semibold">{getWeekRange(currentDate)}</span>
            <button
              onClick={goToNextWeek}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
            >
              Next Week
            </button>
          </div>
        {/* Lunch Section */}
        <div className="w-full mb-8">
          <h2 className="text-2xl font-semibold text-center">Lunch</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {lunchMeals.map((meal) => (
              <MenuItem key={meal.mealID} item={meal} onSignUp={handleSignUp} />
            ))}
          </div>
        </div>
  
        {/* Dinner Section */}
        <div className="w-full">
          <h2 className="text-2xl font-semibold text-center">Dinner</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {dinnerMeals.map((meal) => (
              <MenuItem key={meal.mealID} item={meal} onSignUp={handleSignUp} />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default Menu;
    
