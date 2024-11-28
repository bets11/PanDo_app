import { supabase } from "../lib/supabase";
import { getUserUUID } from "./storageService";

export const savePointsToUser = async (userId, pointsToAdd) => {
    console.log("Starting to save points to user...");
  try {
    // Fetch the current points of the user
    const { data: userData, error: fetchError } = await supabase
      .from("profiles") 
      .select("points")
      .eq("id", userId)
      .single();

    if (fetchError) throw fetchError;

    const currentPoints = userData.points || 0;

    // Update the user's points
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ points: currentPoints + pointsToAdd })
      .eq("id", userId);

    if (updateError) throw updateError;

    console.log(`Successfully added ${pointsToAdd} points to user.`);
  } catch (err) {
    console.error("Error saving points:", err.message);
  }
};

export const getPointsFromUser = async () => {
  console.log("Starting to get points from user...");
  const userId = await getUserUUID();

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("points")
      .eq("id", userId)
      .single();

    if (error) throw error;

    console.log("Fetched points from user:", data.points);
    return data.points;
  } catch (err) {
    console.error("Error getting points:", err.message);
  }
};

export const updateUserPoints = async (newPoints) => {
  console.log("Starting to update user points...");
  const userId = await getUserUUID();

  try {
    const { error } = await supabase
      .from("profiles")
      .update({ points: newPoints })
      .eq("id", userId);

    if (error) throw error;

    console.log("Successfully updated user points.");
  } catch (err) {
    console.error("Error updating user points:", err.message);
  }
}
