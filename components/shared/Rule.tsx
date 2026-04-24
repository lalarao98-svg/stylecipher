interface RuleProps {
  color: string;
  thin?: boolean;
  className?: string;
}

export default function Rule({ color, thin, className = "" }: RuleProps) {
  return (
    <div
      className={className}
      style={{
        height: thin ? 1 : 3,
        width: "100%",
        background: color,
        flexShrink: 0,
      }}
    />
  );
}
