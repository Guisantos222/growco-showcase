type ExperienceStageProps = {
  children:
    React.ReactNode;
};

export function ExperienceStage({
  children,
}: ExperienceStageProps) {
  return (
    <main
      id="experience"
      className="relative isolate overflow-clip"
    >
      {children}
    </main>
  );
}