export const updateUsersCount = (rooms, namespace, roomType, room) => {
  namespace
    .to(room)
    .emit("updateUsersCount", rooms[roomType][room].users.length);
};

export const isMatchConnecting = (
  rooms,
  match,
  socket,
  room,
  roomType,
  settings,
  namespace,
  usersType
) => {
  const matchRoomType = roomType === "text" ? "textroom" : "voiceroom";
  room = `${matchRoomType}-${socket.id}-${match.socketId}`;

  socket.leave(`waitingroom-${socket.id}`);
  match.socket.leave(`waitingroom-${match.socketId}`);

  socket.join(room);
  match.socket.join(room);

  rooms[roomType][room] = {
    users: [socket.id, match.socketId],
    settings: settings,
  };

  updateUsersCount(rooms, namespace, roomType, room);

  if (roomType === "voice") {
    match.socket.emit("is-initiator", true);
    socket.emit("is-initiator", false);
  }

  namespace.to(room).emit("chat ready");

  if (roomType === "voice") {
    socket.on("voice-data", (audioData) => {
      namespace.to(socket.room).emit("voice-data", audioData);
    });
  }

  usersType.splice(usersType.indexOf(match), 1);

  socket.room = room;
  match.socket.room = room;
};

export const connectingToWaitingRoom = (
  rooms,
  usersType,
  socket,
  namespace,
  settings,
  room,
  roomType
) => {
  usersType.push({ socketId: socket.id, settings, socket });

  room = `waitingroom-${socket.id}`;
  socket.join(room);

  rooms[roomType][room] = {
    users: [socket.id],
    settings: settings,
  };

  updateUsersCount(rooms, namespace, roomType, room);

  socket.room = room;
};

export const disconnectSocket = (
  rooms,
  socketRoom,
  socketId,
  namespace,
  roomType,
  isVoice
) => {
  const room = socketRoom;
  const nsType = roomType === "text" ? "chat" : "voice chat";

  if (rooms[roomType][room]) {
    rooms[roomType][room].users = rooms[roomType][room].users.filter(
      (id) => id !== socketId
    );

    if (isVoice) {
      if (rooms[roomType][room].users.length === 1) {
        namespace.to(room).emit("end call");
      }
    }

    updateUsersCount(rooms, namespace, roomType, room);

    if (rooms[roomType][room].users.length < 2) {
      namespace.to(room).emit(`${nsType} not ready`);
      delete rooms[roomType][room];
    }
  }
};

export const leaveWaitingRoom = (socket, usersType) => {
  usersType.splice(
    usersType.findIndex((user) => user.socketId === socket.id),
    1
  );
  socket.leave(`waitingroom-${socket.id}`);
};

export const isMatchingRoom = (userA, userB) => {
  const isMatchingGender = (userA, userB) => {
    const genderA = userA.selectedGender;
    const genderB = userB.selectedGender;
    const companionGenderA = userA.selectedCompanionGender;
    const companionGenderB = userB.selectedCompanionGender;

    const isASelectingSomeone = genderA === "someone";
    const isBSelectingSomeone = genderB === "someone";

    return (
      isASelectingSomeone ||
      isBSelectingSomeone ||
      (companionGenderA === "someone" && genderB === "male") ||
      (companionGenderB === "someone" && genderA === "male") ||
      (genderA === "female" && genderB === "female") ||
      genderA === companionGenderB ||
      genderB === companionGenderA
    );
  };

  const genderMatchesAB = isMatchingGender(userA, userB);
  const genderMatchesBA = isMatchingGender(userB, userA);

  const ageMatchesAB =
    userA.selectedGender === "someone" ||
    (userB.selectedCompanionAges.length === 0
      ? true
      : userB.selectedCompanionAges.some((ageRange) => {
          const [minAge, maxAge] = ageRange.split("-").map(Number);
          const ageA = parseInt(userA.selectedAge.split("-")[0]);
          return ageA >= minAge && ageA <= maxAge;
        }));

  const ageMatchesBA =
    userB.selectedGender === "someone" ||
    (userA.selectedCompanionAges.length === 0
      ? true
      : userA.selectedCompanionAges.some((ageRange) => {
          const [minAge, maxAge] = ageRange.split("-").map(Number);
          const ageB = parseInt(userB.selectedAge.split("-")[0]);
          return ageB >= minAge && ageB <= maxAge;
        }));

  return genderMatchesAB && genderMatchesBA && ageMatchesAB && ageMatchesBA;
};
