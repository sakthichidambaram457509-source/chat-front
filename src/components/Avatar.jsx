function Avatar({ username, online = false }) {
  return (
    <div className="relative">
      <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
        {username?.charAt(0).toUpperCase()}
      </div>

      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
      )}
    </div>
  );
}

export default Avatar;